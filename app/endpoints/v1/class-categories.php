<?php
/**
 * Google Auth Shortcode.
 *
 * @link          https://themedyno.com/
 * @since         1.0.0
 *
 * @package       AFLTIMPTR\PluginTest
 */

namespace AFLTIMPTR\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFLTIMPTR\Core\Endpoint;
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
					'callback'            => array( $this, 'amazon_api_connection' ),
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
	public function amazon_api_connection( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$categories = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'orderby'    => 'name',
				'hide_empty' => false,
			)
		);

		$categories = $this->treeify_terms( $categories );

		return new WP_REST_Response( $categories, 200 );
	}

	public function treeify_terms( $terms, $root_id = 0 ) {
		$tree = array();

		foreach ( $terms as $term ) {
			if ( $term->parent === $root_id ) {
				array_push(
					$tree,
					array(
						'name'     => $term->name,
						'slug'     => $term->slug,
						'id'       => $term->term_taxonomy_id,
						'count'    => $term->count,
						'children' => $this->treeify_terms( $terms, $term->term_id ),
					)
				);
			}
		}

		return $tree;
	}
}
