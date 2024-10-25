<?php
/**
 * API endpoint class for verifying ASINs and fetching products data from the Amazon
 */

namespace AFFPRODIMP\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Endpoint;
use AFFPRODIMP\Core\ProductAdvertisingApi;
use AFFPRODIMP\Core\ProductDataHandler;
use AFFPRODIMP\Core\Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Class AsinVerification
 *
 * @codingStandardsIgnoreStart
 */
class AsinVerification extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $endpoint = 'asin-verification';

	/**
	 * Register the routes for handling ASIN vefirication functionality.
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
					'callback'            => array( $this, 'asin_verification' ),
					'permission_callback' => array( $this, 'edit_permission' ),
				),
			)
		);
	}

	/**
	 *
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error
	 * @since 1.0.0
	 */
	public function asin_verification( WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-NONCE' );
		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_REST_Response( 'Invalid nonce', 403 );
		}

		$access_key   = get_option( 'affprodimp_amazon_access_key' );
		$secret_key   = get_option( 'affprodimp_amazon_secret_key' );
		$country_code = get_option( 'affprodimp_amazon_country_code' );
		$affiliate_id = get_option( 'affprodimp_amazon_affiliate_id' );
		$asin_codes   = isset( $request['asinCodes'] ) ? array_map( 'sanitize_text_field', (array) $request['asinCodes'] ) : [];

		if ( empty( $asin_codes ) ) {
			return new WP_Error( 'rest_affprodimp_amazon_product_fetch', __( 'ASIN Codes parameter value can not be empty', 'affiliate-products-importer-for-woocommerce' ), array( 'status' => 500 ) );
		}

		if ( ! empty( $access_key ) && ! empty( $secret_key ) && ! empty( $country_code ) && ! empty( $affiliate_id ) ) {
			$marketplace = esc_html( Settings::get_amazon_marketplace( $country_code ) );
			$host        = esc_html( Settings::get_amazon_host( $country_code ) );
			$region      = esc_html( Settings::get_amazon_region( $country_code ) );

			try {
				$api          = new ProductAdvertisingApi( $access_key, $secret_key, $marketplace, $affiliate_id, $host, $region );
				$result       = $api->fetchProductsByItemIds( $asin_codes );
				$items        = ( isset( $result->ItemsResult->Items ) ) ? $result->ItemsResult->Items : array();
				
				$fetch_result = ProductDataHandler::process_items($items, $country_code, $affiliate_id);
				$fetch_errors = ( isset( $result->Errors ) ) ? $result->Errors : array();
				
				$response_data = array(
					'fetch_result' => $fetch_result,
					'fetch_errors' => $fetch_errors,
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

/**
 * @codingStandardsIgnoreEnd
 */
