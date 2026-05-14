<?php
/**
 * API endpoint class for saving and fetching the Amazon AWS Settings
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Abort if called directly.
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use AFFPRODIMP\Core\Settings;
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
						'client_id'   => array(
							'required'    => false,
							'description' => \esc_html__( 'Amazon Client ID is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'client_secret'   => array(
							'required'    => false,
							'description' => \esc_html__( 'Amazon Client Secret is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'api_version' => array(
							'required'    => false,
							'description' => \esc_html__( 'Creators API Version is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'access_key'   => array(
							'required'    => false,
							'description' => __( 'Amazon Access Key is required.', 'affiliate-products-importer-for-woocommerce' ),
							'type'        => 'string',
						),
						'secret_key'   => array(
							'required'    => false,
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
							'description' => __( 'Amazon Tracking ID is required.', 'affiliate-products-importer-for-woocommerce' ),
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

		$affprodimp_amazon_api_type     = get_option( 'affprodimp_amazon_api_type' );
		$affprodimp_amazon_client_id     = get_option( 'affprodimp_amazon_client_id' );
		$affprodimp_amazon_client_secret = get_option( 'affprodimp_amazon_client_secret' );
		$affprodimp_amazon_access_key    = get_option( 'affprodimp_amazon_access_key' );
		$affprodimp_amazon_secret_key    = get_option( 'affprodimp_amazon_secret_key' );
		$affprodimp_amazon_affiliate_id  = get_option( 'affprodimp_amazon_affiliate_id' );

		$affprodimp_amazon_country_code  = get_option( 'affprodimp_amazon_country_code', 'us' );
		$country_code = 'gb' === $affprodimp_amazon_country_code ? 'uk' : $affprodimp_amazon_country_code;

		$affprodimp_amazon_api_version = get_option( 'affprodimp_amazon_api_version', Settings::get_amazon_default_credential_version( $country_code ) );

		$response_data = array(
			'api_type'      => $affprodimp_amazon_api_type ? \esc_html( $affprodimp_amazon_api_type ) : 'pa_api',
			'client_id'     => $affprodimp_amazon_client_id ? \esc_html( $affprodimp_amazon_client_id ) : '',
			'client_secret' => $affprodimp_amazon_client_secret ? \esc_html( $affprodimp_amazon_client_secret ) : '',
			'api_version' => \esc_html( $affprodimp_amazon_api_version ),
			'access_key'   => $affprodimp_amazon_access_key ? esc_html( $affprodimp_amazon_access_key ) : '',
			'secret_key'   => $affprodimp_amazon_secret_key ? esc_html( $affprodimp_amazon_secret_key ) : '',
			'country_code' => $country_code ? esc_html( $country_code ) : '',
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

		$api_type     = \sanitize_text_field( $request['api_type'] );
		$client_id     = \sanitize_text_field( $request['client_id'] );
		$client_secret = \sanitize_text_field( $request['client_secret'] );
		$api_version = \sanitize_text_field( $request['api_version'] );
		$access_key   = sanitize_text_field( $request['access_key'] );
		$secret_key   = sanitize_text_field( $request['secret_key'] );
		$country_code = sanitize_text_field( $request['country_code'] );
		$affiliate_id = sanitize_text_field( $request['affiliate_id'] );

		if ( ! empty( $country_code ) && ! empty( $affiliate_id ) ) {
			try {
				
				update_option( 'affprodimp_amazon_api_type', $api_type );

				if( $api_type == 'creators_api' ){
					\update_option( 'affprodimp_amazon_client_id', $client_id );
					\update_option( 'affprodimp_amazon_client_secret', $client_secret );
					\update_option( 'affprodimp_amazon_api_version', $api_version );
				}else{
					update_option( 'affprodimp_amazon_access_key', $access_key );
					update_option( 'affprodimp_amazon_secret_key', $secret_key );
				}
				
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
