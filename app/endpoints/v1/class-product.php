<?php
/**
 * Products Endpoint.
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use AFFPRODIMP\Core\Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_Query;

class Product extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $endpoint = 'product';

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
					'methods'             => 'POST',
					'args'                => array(
						'asin'          => array(
							'required' => true,
							'type'     => 'string',
						),
						'post_title'    => array(
							'required' => true,
							'type'     => 'string',
						),
						'post_content'  => array(
							'required' => true,
							'type'     => 'string',
						),
						'image_primary' => array(
							'required' => true,
							'type'     => 'string',
						),
						'regular_price' => array(
							'required' => true,
							'type'     => 'number',
						),
						'sale_price'    => array(
							'required' => false,
						),
						'categories'    => array(
							'required' => true,
							'type'     => 'array',
						),
					),
					'callback'            => array( $this, 'save_product' ),
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
	public function save_product( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		// Sanitize and escape the inputs
		$asin          = sanitize_text_field( $request['asin'] );
		$post_title    = sanitize_text_field( $request['post_title'] );
		$post_name     = sanitize_title( $post_title );
		$post_content  = wp_kses_post( $request['post_content'] ); // Allows safe HTML content
		$image_primary = esc_url_raw( $request['image_primary'] );
		$regular_price = floatval( $request['regular_price'] );
		$sale_price    = isset( $request['sale_price'] ) ? floatval( $request['sale_price'] ) : '';
		$categories    = array_map( 'sanitize_text_field', $request['categories'] ); // Sanitize each category

		// Prepare product URL using settings and ASIN
		$country_code = get_option( 'affprodimp_amazon_country_code' );
		$affiliate_id = get_option( 'affprodimp_amazon_affiliate_id' );
		$product_url  = Settings::get_product_url( $country_code, $affiliate_id, $asin );

		// Prepare the post array
		$new_post = array(
			'post_title'   => $post_title,
			'post_content' => $post_content,
			'post_status'  => 'publish',
			'post_date'    => current_time( 'mysql' ),
			'post_author'  => get_current_user_id(), // Adjust if dynamic author assignment is needed
			'post_type'    => 'product',
			'post_name'    => $post_name,
		);

		// Insert the post into the database
		$post_id = wp_insert_post( $new_post );
		$guid    = get_post_field( 'guid', $post_id );

		/*===================Update product categories=======================*/
		wp_set_post_terms( $post_id, $categories, 'product_cat' );

		/*===================Update product type=======================*/
		wp_set_object_terms( $post_id, 'external', 'product_type' );

		/*===================Update product Images=======================*/
		update_post_meta( $post_id, 'affprodimp_product_img_url', $image_primary );

		/*===================Update product ASIN=======================*/
		update_post_meta( $post_id, 'affprodimp_product_asin', $asin );

		/*===================Update product price=======================*/
		$price = ! empty( $sale_price ) ? $sale_price : $regular_price;
		update_post_meta( $post_id, '_price', $price );
		update_post_meta( $post_id, '_regular_price', $regular_price );

		if ( ! empty( $sale_price ) ) {
			update_post_meta( $post_id, '_sale_price', $sale_price );
		}

		/*===================Update product URL=======================*/
		update_post_meta( $post_id, '_product_url', $product_url );

		// Prepare the return response
		$return = array(
			'product_id'    => $post_id,
			'product_asin'  => $asin,
			'product_title' => $post_title,
			'product_url'   => $guid,
			'image_primary' => $image_primary,
		);

		return new WP_REST_Response( $return );
	}
}
