<?php
/**
 * Google Auth Shortcode.
 *
 * @link          https://themedyno.com/
 * @since         1.0.0
 *
 * @author        AFFIMPORTR (https://themedyno.com)
 * @package       AFFIMPORTR\PluginTest
 *
 * @copyright (c) 2024, ThemeDyno (http://themedyno.com)
 */

namespace AFFIMPORTR\App\Endpoints\V1;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFIMPORTR\Core\Endpoint;

class AmazonAPIConnection extends Endpoint {
	/**
	 * API endpoint for the current endpoint.
	 *
	 * @since 1.0.0
	 *
	 * @var string $endpoint
	 */
	protected $endpoint = 'amazon-api-connection';

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
						'amazon_api_connection',
					),
					'permission_callback' => array(
						$this,
						'edit_permission',
					),
				)
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

		$access_key = get_option( 'azoncom_amazon_access_key' );
        $secret_key  = get_option( 'azoncom_amazon_secret_key' );
		$country_code  = get_option( 'azoncom_amazon_country_code' );
		$affiliate_id  = get_option( 'azoncom_amazon_affiliate_id' );

        if ( $access_key != "" && $secret_key != "" && $country_code != "" && $affiliate_id !="" ){
            // $marketplace = \AZONCOM\Core::getAmazonMarketplace($country_code);
            // $host = \AZONCOM\Core::getAmazonHost($country_code);
            // $region = \AZONCOM\Core::getAmazonRegion($country_code);
            
            // try {
            //     $ProductAdvertisingApi = new ProductAdvertisingApi($access_key, $secret_key, $marketplace, $affiliate_id, $host, $region);
            //     $ProductAdvertisingApi->fetchProductsByKeywords("Pet Food", 1);
            // }
            // catch(\Exception $e){
            //     $status = $e->getCode() ? $e->getCode() : 500;
            //     return new WP_Error('rest_azoncom_amazon_api_status', $e->getMessage(), ['status' => $status]);
            // }
            $data = [
                'status' => 'success',
                'message' => 'The connection to your Amazon API was successful.'
            ];
        }else{
            $data = [
                'status' => 'incomplete',
                'message' => 'Your Amazon API is not yet set up.'
            ];
        }

		return new \WP_REST_Response( $response_data, 200 );
	}

}
