<?php
/**
 * Products Endpoint.
 *
 * @link          https://themedyno.com/
 * @since         1.0.0
 *
 * @package       AFLTIMPTR\PluginTest
 */

namespace AFLTIMPTR\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || exit;

use AFLTIMPTR\Core\Endpoint;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class Products extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $endpoint = 'products';

	/**
	 * Register the routes for handling auth functionality.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->get_namespace(),
			$this->get_endpoint(),
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_products' ),
					'permission_callback' => array( $this, 'edit_permission' ),
				),
			)
		);
	}

	/**
	 * Handle the request to get products.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function get_products( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		global $wpdb;

		$page    = $request->get_param( 'page' ) ? $request->get_param( 'page' ) : 1;
		$keyword = $request->get_param( 'keyword' );
		$limit   = $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 50;
		$start   = ( $page - 1 ) * $limit;

		$search_sql = $keyword ? $wpdb->prepare( 'AND wp_posts.post_title LIKE %s', '%' . $wpdb->esc_like( $keyword ) . '%' ) : '';

		$sql = $wpdb->prepare(
			"
            SELECT 
                wp_posts.ID AS product_id,
                wp_posts.guid AS product_url,
                wp_posts.post_title AS product_title,
                wp_posts.post_date AS product_import_date,
                wp_postmeta.meta_value AS product_asin
            FROM 
                wp_posts
            LEFT JOIN 
                wp_postmeta ON (wp_posts.ID = wp_postmeta.post_id)
            WHERE 
                wp_posts.post_type = %s
                AND wp_posts.post_status = %s
                AND wp_postmeta.meta_key = %s
                $search_sql
            ORDER BY product_id DESC
            LIMIT %d, %d",
			'product',
			'publish',
			'_azoncom_amz_asin',
			$start,
			$limit
		);

		$products = $wpdb->get_results( $sql );

		$count_sql = $wpdb->prepare(
			"
            SELECT 
                COUNT(*) AS total
            FROM 
                wp_posts
            LEFT JOIN 
                wp_postmeta ON (wp_posts.ID = wp_postmeta.post_id)
            WHERE 
                wp_posts.post_type = %s
                AND wp_posts.post_status = %s
                AND wp_postmeta.meta_key = %s
                $search_sql",
			'product',
			'publish',
			'_azoncom_amz_asin'
		);

		$total = $wpdb->get_var( $count_sql );

		foreach ( $products as $product ) {
			$post_id      = $product->product_id;
			$product->key = $post_id;

			$thumbnail_id       = get_post_thumbnail_id( $post_id ) ? get_post_thumbnail_id( $post_id ) : $post_id;
			$img_src            = wp_get_attachment_image_src( $thumbnail_id );
			$product->image_src = $img_src[0];

			$sync_last_date          = get_post_meta( $post_id, '_wooazon_sync_last_date', true );
			$product->sync_last_date = $sync_last_date ? $this->time_ago( $sync_last_date ) : $this->time_ago( strtotime( $product->product_import_date ) );
		}

		$response = array(
			'products' => $products,
			'total'    => $total,
			'page'     => (int) $page,
		);

		return new WP_REST_Response( $response );
	}

	/**
	 * Calculate the time difference in human-readable format.
	 *
	 * @param int $time The timestamp.
	 * @return string
	 * @since 1.0.0
	 */
	public function time_ago( $time ) {
		$diff = time() - $time;

		if ( $diff < 60 ) {
			return $diff <= 5 ? 'Just now' : "$diff seconds ago";
		}

		$minutes = round( $diff / 60 );
		if ( $minutes < 60 ) {
			return $minutes === 1 ? 'One minute ago' : "$minutes minutes ago";
		}

		$hours = round( $diff / 3600 );
		if ( $hours < 24 ) {
			return $hours === 1 ? 'An hour ago' : "$hours hours ago";
		}

		$days = round( $diff / 86400 );
		if ( $days < 7 ) {
			return $days === 1 ? 'Yesterday' : "$days days ago";
		}

		$weeks = round( $diff / 604800 );
		if ( $weeks < 4.3 ) {
			return $weeks === 1 ? 'A week ago' : "$weeks weeks ago";
		}

		$months = round( $diff / 2600640 );
		if ( $months < 12 ) {
			return $months === 1 ? 'A month ago' : "$months months ago";
		}

		$years = round( $diff / 31207680 );
		return $years === 1 ? 'One year ago' : "$years years ago";
	}
}
