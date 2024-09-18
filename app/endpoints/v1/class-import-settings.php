<?php
/**
 * API endpoint class for the imort settings
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Abort if called directly.
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class ImportSettings extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string $endpoint
	 */
	protected $endpoint = 'import-settings';

	/**
	 * Register the routes for handling import settings functionality.
	 *
	 * @return void
	 * @since 1.0.0
	 *
	 */
	public function register_routes() {
		// TODO
		// Add a new Route to logout.

		// Route to get auth url.
		register_rest_route(
			$this->get_namespace(),
			$this->get_endpoint(),
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array(
						$this,
						'get_settings',
					),
					'permission_callback' => array(
						$this,
						'edit_permission',
					),
				),
				array(
					'methods'             => 'POST',
					'args'                => array(
						'remote_image' => array(
							'required'    => true,
							'description' => __( 'Remore image setting is required.', 'affiliate-products-importer' ),
							'type'        => 'string',
						),
					),
					'callback'            => array(
						$this,
						'save_settings',
					),
					'permission_callback' => array(
						$this,
						'edit_permission',
					),
				),
			)
		);
	}

	/**
	 * Save the client id and secret.
	 *
	 *
	 * @since 1.0.0
	 */
	public function get_settings( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$affprodimp_settings_remote_image = get_option( 'affprodimp_settings_remote_image' );

		$response_data = array(
			'remote_image' => $affprodimp_settings_remote_image ? esc_html( $affprodimp_settings_remote_image ) : 'Yes',
		);

		return new WP_REST_Response( $response_data, 200 );
	}

	/**
	 * Handle the Amazon API connection.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function save_settings( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$remote_image = sanitize_text_field( $request['remote_image'] );

		if ( ! empty( $remote_image ) ) {
			try {
				update_option( 'affprodimp_settings_remote_image', $remote_image );

				$response_data = array(
					'status'  => 'success',
					'message' => __( 'Import Settings saved successfully.', 'affiliate-products-importer' ),
				);
				return new WP_REST_Response( $response_data, 200 );
			} catch ( \Exception $e ) {
				return new WP_Error( 'rest_affprodimp_amazon_api_status', esc_html( $e->getMessage() ), array( 'status' => $e->getCode() ? $e->getCode() : 500 ) );
			}
		} else {
			$response_data = array(
				'status' => 'error',
				'error'  => array(
					'code'    => 'incomplete',
					'message' => __( 'Your Amazon API is not yet set up.', 'affiliate-products-importer' ),
				),
			);
			return new WP_REST_Response( $response_data, 400 );
		}
	}
}
