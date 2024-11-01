<?php
/**
 * API endpoint class for verifying the Amazon AWS settings.
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use AFFPRODIMP\Core\ProductAdvertisingApi;
use AFFPRODIMP\Core\Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class AmazonAPIConnection extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $endpoint = 'amazon-api-connection';

	/**
	 * Register the routes for handling Amazon AWS API validation functionality.
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
					'callback'            => array( $this, 'verify_amazon_api_connection' ),
					'permission_callback' => array( $this, 'edit_permission' ),
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
					'callback'            => array( $this, 'verify_amazon_api_settings' ),
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
	public function verify_amazon_api_connection( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$access_key   = get_option( 'affprodimp_amazon_access_key' );
		$secret_key   = get_option( 'affprodimp_amazon_secret_key' );
		$country_code = get_option( 'affprodimp_amazon_country_code' );
		$affiliate_id = get_option( 'affprodimp_amazon_affiliate_id' );

		if ( ! empty( $access_key ) && ! empty( $secret_key ) && ! empty( $country_code ) && ! empty( $affiliate_id ) ) {
			$marketplace = Settings::get_amazon_marketplace( $country_code );
			$host        = Settings::get_amazon_host( $country_code );
			$region      = Settings::get_amazon_region( $country_code );

			try {
				$api = new ProductAdvertisingApi( $access_key, $secret_key, $marketplace, $affiliate_id, $host, $region );
				$api->fetchProductsByKeywords( 'Pet Food', 1 );
				$response_data = array(
					'status'  => 'success',
					'message' => __( 'The connection to your Amazon API was successful.', 'affiliate-products-importer-for-woocommerce' ),
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

	/**
	 * Handle the Amazon API connection.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function verify_amazon_api_settings( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$access_key   = sanitize_text_field( $request['access_key'] );
		$secret_key   = sanitize_text_field( $request['secret_key'] );
		$country_code = sanitize_text_field( $request['country_code'] );
		$affiliate_id = sanitize_text_field( $request['affiliate_id'] );

		if ( ! empty( $access_key ) && ! empty( $secret_key ) && ! empty( $country_code ) && ! empty( $affiliate_id ) ) {
			$marketplace = Settings::get_amazon_marketplace( $country_code );
			$host        = Settings::get_amazon_host( $country_code );
			$region      = Settings::get_amazon_region( $country_code );

			try {
				$api = new ProductAdvertisingApi( $access_key, $secret_key, $marketplace, $affiliate_id, $host, $region );
				$api->fetchProductsByKeywords( 'Pet Food', 1 );
				$response_data = array(
					'status'  => 'success',
					'message' => __( 'The connection to your Amazon API was successful.', 'affiliate-products-importer-for-woocommerce' ),
				);
				return new WP_REST_Response( $response_data, 200 );
			} catch ( \Exception $e ) {
				$error_message = $e->getMessage();
				$error_message = stristr( $error_message, 'The request has not been correctly signed' ) ? 'The Secret Key is incorrect or not paired with the access key. Please verify both keys in your Amazon Affiliate account settings and ensure they are correctly copied.' : $error_message;
				return new WP_Error( 'rest_affprodimp_amazon_api_status', esc_html( $error_message ), array( 'status' => $e->getCode() ? $e->getCode() : 500 ) );
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
