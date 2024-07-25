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
use WP_Query;

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

		// Get and sanitize request parameters
		$paged          = (int) $request->get_param( 'page' ) ? (int) $request->get_param( 'page' ) : 1;
		$posts_per_page = (int) $request->get_param( 'per_page' ) ? (int) $request->get_param( 'per_page' ) : 50;

		// Set up query arguments
		$args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'meta_key'       => 'affprodimp_amz_asin',
			'orderby'        => 'ID',
			'order'          => 'DESC',
			'posts_per_page' => $posts_per_page,
			'paged'          => $paged,
		);

		// Execute query
		$query         = new WP_Query( $args );
		$total_results = $query->found_posts;

		$products = array();
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();

				$product    = array();
				$product_id = get_the_ID();

				// Populate product data
				$product['product_id']          = $product_id;
				$product['product_url']         = esc_url( get_permalink( $product_id ) );
				$product['product_title']       = esc_html( get_the_title( $product_id ) );
				$product['product_import_date'] = esc_html( get_the_date( '', $product_id ) );
				$product['product_asin']        = esc_html( get_post_meta( $product_id, 'affprodimp_amz_asin', true ) );
				$product['key']                 = $product_id;

				// Get product image
				$thumbnail_id             = get_post_thumbnail_id( $product_id ) ? get_post_thumbnail_id( $product_id ) : $product_id;
				$image_primary            = wp_get_attachment_image_src( $thumbnail_id );
				$product['image_primary'] = esc_url( $image_primary[0] );

				// Get sync last date
				$sync_last_date            = get_post_meta( $product_id, 'affprodimp_sync_last_date', true );
				$product['sync_last_date'] = $sync_last_date ? $this->time_ago( $sync_last_date ) : $this->time_ago( strtotime( $product['product_import_date'] ) );

				$products[] = $product;
			}
			wp_reset_postdata();
		}

		// Prepare response
		$response = array(
			'products' => $products,
			'total'    => $total_results,
			'page'     => (int) $paged,
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
			return 1 === $minutes ? 'One minute ago' : "$minutes minutes ago";
		}

		$hours = round( $diff / 3600 );
		if ( $hours < 24 ) {
			return 1 === $hours ? 'An hour ago' : "$hours hours ago";
		}

		$days = round( $diff / 86400 );
		if ( $days < 7 ) {
			return 1 === $days ? 'Yesterday' : "$days days ago";
		}

		$weeks = round( $diff / 604800 );
		if ( $weeks < 4.3 ) {
			return 1 === $weeks ? 'A week ago' : "$weeks weeks ago";
		}

		$months = round( $diff / 2600640 );
		if ( $months < 12 ) {
			return 1 === $months ? 'A month ago' : "$months months ago";
		}

		$years = round( $diff / 31207680 );
		return 1 === $years ? 'One year ago' : "$years years ago";
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
			$sale_price     = ( isset( $product['sale_price'] ) ) ? $product['sale_price'] : '';
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
			$remore_image = get_option( 'affprodimp_settings_remote_image' );

			if ( 'yes' === $remore_image ) {
				update_post_meta( $post_id, 'affprodimp_product_img_url', $image_primary );

				foreach ( $image_variants as $image_variant ) {
					$urls[] = $image_variant;
				}
				update_post_meta( $post_id, 'affprodimp_product_gallery_url', $urls );
			} else {
				$thumbnail_image_id = \media_sideload_image( $image_primary, $post_id, $post_title, 'id' );
				set_post_thumbnail( $post_id, $thumbnail_image_id );

				$image_variant_ids = array();
				foreach ( $image_variants as $image_variant ) {
					$image_variant_ids[] = \media_sideload_image( $image_variant, $post_id, $post_title, 'id' );
				}

				if ( count( $image_variant_ids ) > 1 ) {
					update_post_meta( $post_id, '_product_image_gallery', implode( ',', $image_variant_ids ) );
				}
			}

			/*===================Update product ASIN=======================*/
			update_post_meta( $post_id, 'affprodimp_amz_asin', $asin );

			/*===================Update product price=======================*/
			$price = !empty( $sale_price ) ? $sale_price : $regular_price;
			update_post_meta( $post_id, '_price', $price );
			update_post_meta( $post_id, '_regular_price', $regular_price );

			if ( !empty( $sale_price ) ) {
				update_post_meta( $post_id, '_sale_price', $sale_price );
			}

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
