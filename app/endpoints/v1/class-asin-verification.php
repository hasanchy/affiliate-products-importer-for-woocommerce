<?php
/**
 * API endpoint class for verifying ASINs and fetching products data from the Amazon
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

/**
 * Class ProductAdvertisingApi
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
			return new WP_Error( 'rest_affprodimp_amazon_product_fetch', __( 'ASIN Codes parameter value cannot be empty', 'affiliate-products-importer' ), array( 'status' => 500 ) );
		}
	
		if ( ! empty( $access_key ) && ! empty( $secret_key ) && ! empty( $country_code ) && ! empty( $affiliate_id ) ) {
			$marketplace = esc_html( Settings::get_amazon_marketplace( $country_code ) );
			$host        = esc_html( Settings::get_amazon_host( $country_code ) );
			$region      = esc_html( Settings::get_amazon_region( $country_code ) );
	
			try {
				$api          = new ProductAdvertisingApi( $access_key, $secret_key, $marketplace, $affiliate_id, $host, $region );
				$result       = $api->fetchProductsByItemIds( $asin_codes );
				$items        = ( isset( $result->ItemsResult->Items ) ) ? $result->ItemsResult->Items : array();
				$fetch_errors = ( isset( $result->Errors ) ) ? $result->Errors : array();
	
				$fetch_result = array();
				foreach ( $items as $index => $item ) {
					$asin = esc_html( $item->ASIN );
					$fetch_result[ $index ]['asin'] = $asin;
					$fetch_result[ $index ]['is_already_imported'] = Settings::is_product_already_imported( $asin );
					$post_title = esc_html( $item->ItemInfo->Title->DisplayValue );
					$fetch_result[ $index ]['post_title'] = $post_title;
					$fetch_result[ $index ]['post_name'] = sanitize_title( $post_title );
					$fetch_result[ $index ]['post_content'] = isset( $item->ItemInfo->Features->DisplayValues ) ? implode( '</br>', array_map( 'esc_html', $item->ItemInfo->Features->DisplayValues ) ) : '';
					$fetch_result[ $index ]['image_primary'] = esc_url( $item->Images->Primary->Large->URL );
	
					if ( isset( $item->Offers->Listings[0]->SavingBasis->Amount ) ) {
						$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->Offers->Listings[0]->SavingBasis->Amount ), 2 );
						$fetch_result[ $index ]['sale_price'] = number_format( floatval( $item->Offers->Listings[0]->Price->Amount ), 2 );
					} else {
						if ( isset( $item->Offers->Listings[0]->Price->Amount ) ) {
							$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->Offers->Listings[0]->Price->Amount ), 2, '.', '' );
						} else {
							$fetch_result[ $index ]['regular_price'] = '';
						}
					}
	
					$fetch_result[ $index ]['product_url'] = esc_url( 'https://' . $marketplace . '/dp/' . $asin . '/?tag=' . $affiliate_id );
				}
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
					'message' => __( 'Your Amazon API is not yet set up.', 'affiliate-products-importer' ),
				),
			);
			return new WP_REST_Response( $response_data, 400 );
		}
	}
}

/**
 * @codingStandardsIgnoreEnd
 */
