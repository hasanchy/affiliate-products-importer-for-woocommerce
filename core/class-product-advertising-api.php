<?php
/**
 * Class to handle the Amazon AWS Advertising API.
 */

namespace AFFPRODIMP\Core;

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

/**
 * Class ProductAdvertisingApi
 *
 * @codingStandardsIgnoreStart
 */
class ProductAdvertisingApi {

	private $accessKey      = null;
	private $secretKey      = null;
	private $marketplace    = null;
	private $partnerTag     = null;
	private $host           = null;
	private $path           = '/paapi5/getitems';
	private $regionName     = null;
	private $serviceName    = 'ProductAdvertisingAPI';
	private $httpMethodName = 'POST';
	private $queryParametes = array();
	private $awsHeaders     = array();
	private $payload        = '';

	private $HMACAlgorithm   = 'AWS4-HMAC-SHA256';
	private $aws4Request     = 'aws4_request';
	private $strSignedHeader = null;
	private $xAmzDate        = null;
	private $currentDate     = null;

	const PAYLOAD_RESOURCES = array(
		'Images.Primary.Large',
		'Images.Variants.Large',
		'ItemInfo.ByLineInfo',
		'ItemInfo.ContentInfo',
		'ItemInfo.ContentRating',
		'ItemInfo.Classifications',
		'ItemInfo.ExternalIds',
		'ItemInfo.Features',
		'ItemInfo.ManufactureInfo',
		'ItemInfo.ProductInfo',
		'ItemInfo.TechnicalInfo',
		'ItemInfo.Title',
		'ItemInfo.TradeInInfo',
		'Offers.Listings.Availability.Message',
		'Offers.Listings.Availability.Type',
		'Offers.Listings.Condition',
		'Offers.Listings.DeliveryInfo.IsFreeShippingEligible',
		'Offers.Listings.MerchantInfo',
		'Offers.Listings.Price',
		'Offers.Listings.SavingBasis',
	);

	public function __construct( $accessKey, $secretKey, $marketplace, $partnerTag, $host, $region ) {
		$this->accessKey   = $accessKey;
		$this->secretKey   = $secretKey;
		$this->marketplace = $marketplace;
		$this->partnerTag  = $partnerTag;
		$this->host        = $host;
		$this->regionName  = $region;
		$this->xAmzDate    = $this->getTimeStamp();
		$this->currentDate = $this->getDate();
		$this->addHeader( 'content-encoding', 'amz-1.0' );
		$this->addHeader( 'content-type', 'application/json; charset=utf-8' );
		$this->addHeader( 'host', $host );
	}

	function setPath( $path ) {
		$this->path = $path;
	}

	function setServiceName( $serviceName ) {
		$this->serviceName = $serviceName;
	}

	function setRegionName( $regionName ) {
		$this->regionName = $regionName;
	}

	function setPayload( $payload ) {
		$this->payload = $payload;
	}

	function setRequestMethod( $method ) {
		$this->httpMethodName = $method;
	}

	function addHeader( $headerName, $headerValue ) {
		$this->awsHeaders [ $headerName ] = $headerValue;
	}

	private function prepareCanonicalRequest() {
		$canonicalURL  = '';
		$canonicalURL .= $this->httpMethodName . "\n";
		$canonicalURL .= $this->path . "\n" . "\n";
		$signedHeaders = '';
		foreach ( $this->awsHeaders as $key => $value ) {
			$signedHeaders .= $key . ';';
			$canonicalURL  .= $key . ':' . $value . "\n";
		}
		$canonicalURL         .= "\n";
		$this->strSignedHeader = substr( $signedHeaders, 0, - 1 );
		$canonicalURL         .= $this->strSignedHeader . "\n";
		$canonicalURL         .= $this->generateHex( $this->payload );
		return $canonicalURL;
	}

	private function prepareStringToSign( $canonicalURL ) {
		$stringToSign  = '';
		$stringToSign .= $this->HMACAlgorithm . "\n";
		$stringToSign .= $this->xAmzDate . "\n";
		$stringToSign .= $this->currentDate . '/' . $this->regionName . '/' . $this->serviceName . '/' . $this->aws4Request . "\n";
		$stringToSign .= $this->generateHex( $canonicalURL );
		return $stringToSign;
	}

	private function calculateSignature( $stringToSign ) {
		$signatureKey    = $this->getSignatureKey( $this->secretKey, $this->currentDate, $this->regionName, $this->serviceName );
		$signature       = hash_hmac( 'sha256', $stringToSign, $signatureKey, true );
		$strHexSignature = strtolower( bin2hex( $signature ) );
		return $strHexSignature;
	}

	public function getHeaders() {
		$this->awsHeaders ['x-amz-date'] = $this->xAmzDate;
		ksort( $this->awsHeaders );

		// Step 1: CREATE A CANONICAL REQUEST
		$canonicalURL = $this->prepareCanonicalRequest();

		// Step 2: CREATE THE STRING TO SIGN
		$stringToSign = $this->prepareStringToSign( $canonicalURL );

		// Step 3: CALCULATE THE SIGNATURE
		$signature = $this->calculateSignature( $stringToSign );

		// Step 4: CALCULATE AUTHORIZATION HEADER
		if ( $signature ) {
			$this->awsHeaders ['Authorization'] = $this->buildAuthorizationString( $signature );
			return $this->awsHeaders;
		}
	}

	private function buildAuthorizationString( $strSignature ) {
		return $this->HMACAlgorithm . ' ' . 'Credential=' . $this->accessKey . '/' . $this->getDate() . '/' . $this->regionName . '/' . $this->serviceName . '/' . $this->aws4Request . ',' . 'SignedHeaders=' . $this->strSignedHeader . ',' . 'Signature=' . $strSignature;
	}

	private function generateHex( $data ) {
		return strtolower( bin2hex( hash( 'sha256', $data, true ) ) );
	}

	private function getSignatureKey( $key, $date, $regionName, $serviceName ) {
		$kSecret  = 'AWS4' . $key;
		$kDate    = hash_hmac( 'sha256', $date, $kSecret, true );
		$kRegion  = hash_hmac( 'sha256', $regionName, $kDate, true );
		$kService = hash_hmac( 'sha256', $serviceName, $kRegion, true );
		$kSigning = hash_hmac( 'sha256', $this->aws4Request, $kService, true );

		return $kSigning;
	}

	private function getTimeStamp() {
		return gmdate( 'Ymd\THis\Z' );
	}

	private function getDate() {
		return gmdate( 'Ymd' );
	}

	public function getSortBy( $order ) {
		$sortBy = '';
		switch ( $order ) {
			case 'avg_customer_reviews':
				$sortBy = 'AvgCustomerReviews';
				break;
			case 'featured':
				$sortBy = 'Featured';
				break;
			case 'newest_arrivals':
				$sortBy = 'NewestArrivals';
				break;
			case 'price_high_to_low':
				$sortBy = 'Price:HighToLow';
				break;
			case 'price_low_to_high':
				$sortBy = 'Price:LowToHigh';
				break;
			default:
				$sortBy = 'Relevance';
				break;
		}

		return $sortBy;
	}

	public function fetchProductsByItemIds( $itemIds ) {
		$payload                = array();
		$payload['ItemIds']     = $itemIds;
		$payload['Resources']   = self::PAYLOAD_RESOURCES;
		$payload['PartnerTag']  = $this->partnerTag;
		$payload['PartnerType'] = 'Associates';
		$payload['Marketplace'] = $this->marketplace;
		$payload['Operation']   = 'GetItems';

		$payload_content = wp_json_encode( $payload );

		$this->setPayload( $payload_content );
		$this->addHeader( 'x-amz-target', 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems' );

		$headers      = $this->getHeaders();
		$headerString = '';
		foreach ( $headers as $key => $value ) {
			$headerString .= $key . ': ' . $value . "\r\n";
		}

		$args = array(
			'headers' => $headerString,
			'method'  => 'POST',
			'body'    => $payload_content,
			'timeout' => 60
		);

		$request = wp_remote_request( 'https://' . $this->host . $this->path, $args );
		if ( is_wp_error( $request ) ) {
			$error_message = $request->get_error_message();
			throw new \Exception( $error_message ? $error_message : 'Unable to connect to the Amazon API. Please verify your Amazon API settings.' );
		}
		$body         = wp_remote_retrieve_body( $request );
		$body_data    = json_decode( $body );

		return $body_data;
	}

	public function fetchProductsByKeywords( $keyword, $limit = 10, $page = 1, $order = '' ) {
		$payload                = array();
		$payload['Keywords']    = $keyword;
		$payload['Resources']   = self::PAYLOAD_RESOURCES;
		$payload['ItemCount']   = $limit;
		$payload['ItemPage']    = $page;
		$payload['SortBy']      = $this->getSortBy( $order ); // "AvgCustomerReviews", "Featured", "NewestArrivals", "Price:HighToLow", "Price:LowToHigh"
		$payload['PartnerTag']  = $this->partnerTag;
		$payload['PartnerType'] = 'Associates';
		$payload['Marketplace'] = $this->marketplace;
		$payload['Operation']   = 'SearchItems';

		$payload_content = wp_json_encode( $payload );

		$this->setPayload( $payload_content );
		$this->addHeader( 'x-amz-target', 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems' );

		$headers      = $this->getHeaders();
		$headerString = '';
		foreach ( $headers as $key => $value ) {
			$headerString .= $key . ': ' . $value . "\r\n";
		}

		$args = array(
			'headers' => $headerString,
			'method'  => 'POST',
			'body'    => $payload_content,
			'timeout' => 60
		);

		$request = wp_remote_request( 'https://' . $this->host . $this->path, $args );
		if ( is_wp_error( $request ) ) {
			$error_message = $request->get_error_message();
			throw new \Exception( $error_message ? $error_message : 'Unable to connect to the Amazon API. Please verify your Amazon API settings.' );
		}
		$respose_code = wp_remote_retrieve_response_code( $request );
		$body         = wp_remote_retrieve_body( $request );
		$body_data    = json_decode( $body );

		if ( isset( $body_data->Errors ) ) {
			$message = $body_data->Errors[0]->Message;
			throw new \Exception( $message, $respose_code );
		}

		return $body_data;
	}
}

/**
 * @codingStandardsIgnoreEnd
 */
