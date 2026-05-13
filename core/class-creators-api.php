<?php
/**
 * Class to handle Amazon Creators API
 */

namespace AFFPRODIMPPRO\Core;

defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

class CreatorsApi {

    private $clientId;
    private $clientSecret;
    private $version;         // e.g., 2.1, 2.2, 2.3
    private $tokenEndpoint;
    private $marketplace;     // e.g., www.amazon.com
    private $partnerTag;

    const PAYLOAD_RESOURCES_GETITEMS = array(
		'images.primary.highRes',
		'images.primary.large',
		'images.variants.highRes',
		'images.variants.large',
        'itemInfo.byLineInfo',
        'itemInfo.classifications',
		'itemInfo.contentInfo',
		'itemInfo.contentRating',
		'itemInfo.externalIds',
		'itemInfo.features',
		'itemInfo.manufactureInfo',
		'itemInfo.productInfo',
		'itemInfo.technicalInfo',
		'itemInfo.title',
		'itemInfo.tradeInInfo',
        'offersV2.listings.availability',
		'offersV2.listings.condition',
		'offersV2.listings.dealDetails',
		'offersV2.listings.isBuyBoxWinner',
		'offersV2.listings.loyaltyPoints',
		'offersV2.listings.merchantInfo',
		'offersV2.listings.price',
		'offersV2.listings.type',
	);

	const PAYLOAD_RESOURCES_SEARCHITEMS = array(
		'itemInfo.title',
	);

    const BASE_API_URL = 'https://creatorsapi.amazon';

    public function __construct( $clientId, $clientSecret, $marketplace, $partnerTag, $version, $tokenEndpoint ) {
        $this->clientId     = trim($clientId);
        $this->clientSecret = trim($clientSecret);
        $this->marketplace  = trim($marketplace);
        $this->partnerTag   = trim( $partnerTag );
        $this->version      = trim($version);
        $this->tokenEndpoint= trim($tokenEndpoint);
    }

    /**
     * Get cached access token or fetch a new one
     */
    private function get_access_token( $forceRefresh = false ) {

        if ( $forceRefresh ) {
            delete_option( 'affprodimp_creators_token_' . $this->version );
        }
        
        $option_key = 'affprodimp_creators_token_' . $this->version;

        $cached = get_option( $option_key );

        if (
            is_array( $cached ) &&
            ! empty( $cached['access_token'] ) &&
            ! empty( $cached['expires_at'] ) &&
            time() < (int) $cached['expires_at']
        ) {
            return $cached['access_token'];
        }

        $endpoint = $this->tokenEndpoint;
        if ( ! $endpoint ) {
            throw new \Exception( 'Invalid Creators API version.' );
        }

        $response = wp_remote_post( $endpoint, [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'body' => http_build_query( [
                'grant_type'    => 'client_credentials',
                'client_id'     => $this->clientId,
                'client_secret' => $this->clientSecret,
                'scope'         => 'creatorsapi/default',
            ] ),
            'timeout' => 30,
        ] );

        if ( is_wp_error( $response ) ) {
            throw new \Exception( $response->get_error_message() );
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        $response_code = wp_remote_retrieve_response_code( $response );

        if ( $response_code !== 200 ) {

            if( isset( $body['error_description'] ) ) {

                if( strpos( $body['error_description'], 'invalid_client_secret' ) !== false ){
                    $message = \esc_html__( 'Invalid Client Secret provided', 'affiliate-products-importer-for-woocommerce' );
                }else if( strpos( $body['error'], 'invalid_client' ) !== false ){
                    $message = \esc_html__( 'The Client ID is invalid, or the selected Creators API version does not match your credentials.', 'affiliate-products-importer-for-woocommerce' );
                }else{
                    $message = \esc_html( $body['error_description'] );
                }

            }else if( isset( $body['error'] ) && strpos( $body['error'], 'invalid_client' ) !== false ) {
                
                $message = \esc_html__( 'The Client ID is invalid, or the selected Amazon country does not match your API credentials.', 'affiliate-products-importer-for-woocommerce' );
            } else {
                $message = isset( $body['error'] ) ? \esc_html( $body['error'] ) : \esc_html__( 'An error occurred while fetching access token', 'affiliate-products-importer-for-woocommerce' );

            }

            throw new \Exception( 'Verification failed: ' . $message, $response_code );
        }

        $expires_at = time() + max( 300, (int) $body['expires_in'] - 60 );

        update_option(
            $option_key,
            [
                'access_token' => $body['access_token'],
                'expires_at'   => $expires_at,
            ],
            false // autoload = no
        );

        return $body['access_token'];
    }

    /**
     * Make a Creators API POST request
     */
    private function post( $endpointPath, $payload, $forceRefreshToken = false ) {
        
        $accessToken = $this->get_access_token( $forceRefreshToken );

        $response = wp_remote_post( self::BASE_API_URL . $endpointPath, [
            'headers' => [
                'Content-Type'  => 'application/json',
                'x-marketplace' => $this->marketplace,
                'Authorization' => "Bearer {$accessToken}, Version {$this->version}",
            ],
            'body'    => wp_json_encode($payload),
            'timeout' => 30,
        ]);

        if ( is_wp_error( $response ) ) {
            $error_message = $response->get_error_message();

            if ( stripos( $error_message, 'Operation timed out' ) !== false ) {
                $error_message = \esc_html__( 'The Creators API request timed out before a response was received. This usually happens due to a slow network connection, temporary server issues, or high response time from the API provider. Please try again in a moment.', 'affiliate-products-importer-for-woocommerce' );
            }

            throw new \Exception( 'Creators API request failed: ' . $error_message );
        }

        $body = wp_remote_retrieve_body($response);
        $response_code = wp_remote_retrieve_response_code( $response );
        $data = json_decode($body);

        if ( $response_code !== 200 ) {

            $message = isset( $data->message ) ? \esc_html( $data->message ) : \esc_html__( 'Failed to fetch product data from Amazon Creators API.', 'affiliate-products-importer-for-woocommerce' );
            
            throw new \Exception( $message, $response_code );
        }

        return $data;
    }

    /**
     * Fetch products by ASINs
     */
    public function getItems( array $itemIds ) {
        $payload = array(
            'itemIds'       => $itemIds,
            'itemIdType'    => 'ASIN',
            'marketplace'   => $this->marketplace,
            'partnerTag'    => $this->partnerTag, // replace with your tag
            'resources'     => self::PAYLOAD_RESOURCES_GETITEMS,
        );

        return $this->post('/catalog/v1/getItems', $payload);
    }

    /**
     * Search products by keywords
     */
    public function searchItems( string $keywords, array $params = [], $forceRefreshToken = false ) {

        $payload = array(
            'keywords'      => $keywords,
            'marketplace'   => $this->marketplace,
            'partnerTag'    => $this->partnerTag, // replace with your tag
            'itemCount'     => $params['itemCount'] ?? 10,
            'resources'     => self::PAYLOAD_RESOURCES_SEARCHITEMS,
        );

        return $this->post('/catalog/v1/searchItems', $payload, $forceRefreshToken);
    }
}
