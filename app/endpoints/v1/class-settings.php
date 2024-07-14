<?php
/**
 * Google Auth Shortcode.
 *
 * @link          https://themedyno.com/
 * @since         1.0.0
 *
 * @author        AFLTIMPTR (https://themedyno.com)
 * @package       AFLTIMPTR\PluginTest
 *
 * @copyright (c) 2024, ThemeDyno (http://themedyno.com)
 */

namespace AFLTIMPTR\App\Endpoints\V1;

// Abort if called directly.
defined( 'WPINC' ) || die;

use AFLTIMPTR\Core\Endpoint;

class Settings extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string $endpoint
	 */
	protected $endpoint = 'settings';

	/**
	 * Register the routes for handling auth functionality.
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
						'data' => array(
							'required'    => true,
							'description' => __( 'The client ID from Google API project.', 'affiliate-products-importer' ),
							'type'        => 'object',
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
	public function get_settings( \WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$azoncom_amazon_access_key = get_option( 'azoncom_amazon_access_key' );
        $azoncom_amazon_secret_key  = get_option( 'azoncom_amazon_secret_key' );
		$azoncom_amazon_country_code  = get_option( 'azoncom_amazon_country_code' );
		$azoncom_amazon_affiliate_id  = get_option( 'azoncom_amazon_affiliate_id' );

        $response_data['amazon_api_settings'] = [
            'access_key' => $azoncom_amazon_access_key ? $azoncom_amazon_access_key : "",
            'secret_key'  => $azoncom_amazon_secret_key ? $azoncom_amazon_secret_key : "",
			'country_code' => $azoncom_amazon_country_code ? $azoncom_amazon_country_code : "us",
			'affiliate_id' => $azoncom_amazon_affiliate_id ? $azoncom_amazon_affiliate_id : ""
        ];

		return new \WP_REST_Response( $response_data, 200 );
	}

	/**
	 * Save the client id and secret.
	 *
	 *
	 * @since 1.0.0
	 */
	public function save_settings( \WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		// Validate and sanitize the input data
		$data           = isset( $request['data'] ) ? $request['data'] : array();
		$sanitized_data = array_map( 'sanitize_text_field', $data ); // Sanitize each item in the data array

		// Encode the sanitized data to JSON format
		$affiliateimporter_pixel_data = wp_json_encode( $sanitized_data );
		update_option( 'affiliateimporter_pixel_data', $affiliateimporter_pixel_data );

		return new \WP_REST_Response( array( 'message' => 'Settings saved' ), 200 );
	}
}
