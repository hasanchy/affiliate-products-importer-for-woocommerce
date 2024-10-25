<?php
/**
 * API endpoint class for fetching product categories.
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class Categories extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $endpoint = 'categories';

	/**
	 * Register the routes for handling categories functionality.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_routes() {
		\register_rest_route(
			$this->get_namespace(),
			$this->get_endpoint(),
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_categories' ),
					'permission_callback' => array( $this, 'edit_permission' ),
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_category' ),
					'permission_callback' => array( $this, 'edit_permission' ),
				),
			)
		);
	}

	/**
	 * Handle the Amazon API connection.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function get_categories( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! \wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( \esc_html__( 'Invalid nonce', 'affiliate-products-importer-for-woocommerce' ), 403 );
		}

		$categories = \get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'orderby'    => 'name',
				'hide_empty' => false,
			)
		);

		return new WP_REST_Response( $categories, 200 );
	}

	public function create_category( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! \wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( \esc_html__( 'Invalid nonce', 'affiliate-products-importer-for-woocommerce' ), 403 );
		}

		$params      = $request->get_params();
		$name        = \sanitize_text_field( $params['name'] );
		$parent      = isset( $params['parent'] ) ? \absint( $params['parent'] ) : 0;
		$description = isset( $params['description'] ) ? \sanitize_textarea_field( $params['description'] ) : '';

		$term = \wp_insert_term(
			$name,
			'product_cat',
			array(
				'parent'      => $parent,
				'description' => $description,
			)
		);

		if ( \is_wp_error( $term ) ) {
			return new WP_REST_Response( $term->get_error_message(), 400 );
		}

		return new WP_REST_Response( \esc_html__( 'Category created successfully', 'affiliate-products-importer-for-woocommerce' ), 201 );
	}
}
