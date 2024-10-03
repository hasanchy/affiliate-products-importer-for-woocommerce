<?php
/**
 * API endpoint class for saving and fetching the Amazon AWS Settings
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Abort if called directly.
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class AmazonApiSettings extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string $endpoint
	 */
	protected $endpoint = 'amazon-api-settings';

	/**
	 * Register the routes for handling Amazon API settings functionality.
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
						'access_key'   => array(
							'required'    => true,
							'description' => __( 'Amazon Access Key is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'secret_key'   => array(
							'required'    => true,
							'description' => __( 'Amazon AWS Secret Key is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'country_code' => array(
							'required'    => true,
							'description' => __( 'Amazon Affiliate Country is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'affiliate_id' => array(
							'required'    => true,
							'description' => __( 'Amazon Affiliate ID is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
					),
					'callback'            => array( $this, 'save_amazon_api_settings' ),
					'permission_callback' => array( $this, 'edit_permission' ),
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

		$affprodimp_amazon_access_key   = get_option( 'affprodimp_amazon_access_key' );
		$affprodimp_amazon_secret_key   = get_option( 'affprodimp_amazon_secret_key' );
		$affprodimp_amazon_country_code = get_option( 'affprodimp_amazon_country_code' );
		$affprodimp_amazon_affiliate_id = get_option( 'affprodimp_amazon_affiliate_id' );

		$response_data = array(
			'access_key'   => $affprodimp_amazon_access_key ? esc_html( $affprodimp_amazon_access_key ) : '',
			'secret_key'   => $affprodimp_amazon_secret_key ? esc_html( $affprodimp_amazon_secret_key ) : '',
			'country_code' => $affprodimp_amazon_country_code ? esc_html( $affprodimp_amazon_country_code ) : 'us',
			'affiliate_id' => $affprodimp_amazon_affiliate_id ? esc_html( $affprodimp_amazon_affiliate_id ) : '',
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
	public function save_amazon_api_settings( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$access_key   = sanitize_text_field( $request['access_key'] );
		$secret_key   = sanitize_text_field( $request['secret_key'] );
		$country_code = sanitize_text_field( $request['country_code'] );
		$affiliate_id = sanitize_text_field( $request['affiliate_id'] );

		if ( ! empty( $access_key ) && ! empty( $secret_key ) && ! empty( $country_code ) && ! empty( $affiliate_id ) ) {
			try {
				update_option( 'affprodimp_amazon_access_key', $access_key );
				update_option( 'affprodimp_amazon_secret_key', $secret_key );
				update_option( 'affprodimp_amazon_country_code', $country_code );
				update_option( 'affprodimp_amazon_affiliate_id', $affiliate_id );

				$response_data = array(
					'status'  => 'success',
					'message' => __( 'Settings saved successfully.', 'affiliate-products-importer-for-woocommerce' ),
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
					'message' => __( 'Your Amazon API is not yet set up.', 'affiliate-products-importer-for-woocommerce' ),
				),
			);
			return new WP_REST_Response( $response_data, 400 );
		}
	}
}
