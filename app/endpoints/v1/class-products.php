<?php
/**
 * Products Endpoint.
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
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
	 * Register the routes for handling products functionality.
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
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'save_products' ),
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
		$limit   = $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 50;
		$start   = ( $page - 1 ) * $limit;

		$products = $wpdb->get_results(
			$wpdb->prepare(
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
				ORDER BY product_id DESC
				LIMIT %d, %d",
				'product',
				'publish',
				'_azoncom_amz_asin',
				$start,
				$limit
			)
		);

		$total = $wpdb->get_var(
			$wpdb->prepare(
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
					AND wp_postmeta.meta_key = %s",
				'product',
				'publish',
				'_azoncom_amz_asin'
			)
		);

		foreach ( $products as $product ) {
			$post_id      = $product->product_id;
			$product->key = $post_id;

			$thumbnail_id           = get_post_thumbnail_id( $post_id ) ? get_post_thumbnail_id( $post_id ) : $post_id;
			$image_primary          = wp_get_attachment_image_src( $thumbnail_id );
			$product->image_primary = $image_primary[0];

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

	/**
	 * Handle the request to get products.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function save_products( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$products   = $request['products'];
		$categories = $request['categories'];

		$product_ids   = array();
		$product_asins = array();
		foreach ( $products as $product ) {
			$asin           = $product['asin'];
			$post_title     = $product['post_title'];
			$post_name      = $product['post_name'];
			$post_content   = $product['post_content'];
			$image_primary  = $product['image_primary'];
			$image_variants = $product['image_variants'];
			$regular_price  = $product['regular_price'];
			$price          = $product['price'];
			$product_url    = $product['product_url'];
			$attributes     = $product['attributes'];

			$new_post = array(
				'post_title'   => $post_title,
				'post_content' => $post_content,
				'post_status'  => 'publish',
				'post_date'    => current_time( 'mysql' ),
				'post_author'  => '1',
				'post_type'    => 'product',
				'post_name'    => $post_name,
			);

			$post_id         = wp_insert_post( $new_post );
			$product_ids[]   = $post_id;
			$product_asins[] = $asin;

			/*===================Update product categories=======================*/
			wp_set_post_terms( $post_id, $categories, 'product_cat' );

			/*===================Update product type=======================*/
			wp_set_object_terms( $post_id, 'external', 'product_type' );

			/*===================Update product Images=======================*/
			$remore_image = get_option( 'azoncom_settings_remote_image' );

			if ( $remore_image === 'yes' ) {
				update_post_meta( $post_id, '_azoncom_product_img_url', $image_primary );

				foreach ( $image_variants as $image_variant ) {
					$urls[] = $image_variant;
				}
				update_post_meta( $post_id, '_azoncom_product_gallery_url', $urls );
			} else {
				$thumbnail_image_id = \media_sideload_image( $image_primary, $post_id, $post_title, 'id' );
				set_post_thumbnail( $post_id, $thumbnail_image_id );

				$image_variant_ids = array();
				foreach ( $image_variants as $image_variant ) {
					$image_variant_ids[] = \media_sideload_image( $image_variant, $post_id, $post_title, 'id' );
				}

				if ( sizeof( $image_variant_ids ) > 1 ) {
					update_post_meta( $post_id, '_product_image_gallery', implode( ',', $image_variant_ids ) );
				}
			}

			/*===================Update product ASIN=======================*/
			update_post_meta( $post_id, '_azoncom_amz_asin', $asin );

			/*===================Update product price=======================*/
			if ( $price ) {
				update_post_meta( $post_id, '_price', $price );
			}
			if ( $regular_price ) {
				update_post_meta( $post_id, '_regular_price', $regular_price );
			}
			if ( $sale_price ) {
				update_post_meta( $post_id, '_sale_price', $sale_price );
			}

			$current_time = time();
			update_post_meta( $post_id, '_wooazon_sync_last_date', $current_time );
			// $ret['_price_update_date'] = $current_time;

			/*===================Update product url=======================*/
			update_post_meta( $post_id, '_product_url', $product_url );

			/*===================Update product Attributes=======================*/
			$this->add_product_attribute( $post_id, $attributes );
		}

		$return = array(
			'product_ids'   => $product_ids,
			'product_asins' => $product_asins,
		);

		return new WP_REST_Response( $return );
	}

	public function add_product_attribute( $post_id, $attributes ) {

		foreach ( $attributes as $key => $attribute ) {
			$meta_value[ strtolower( $attribute['name'] ) ] = array(
				'name'         => $attribute['name'],
				'value'        => $attribute['value'],
				'position'     => $key,
				'is_visible'   => 1,
				'is_variation' => 0,
				'is_taxonomy'  => 0,
			);
		}

		update_post_meta( $post_id, '_product_attributes', $meta_value );

		/*====================================================*/
	}
}
