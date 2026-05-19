<?php
/**
 * Class to boot up plugin.
 */

namespace AFFPRODIMP\Core;

// Avoid direct file request
defined( 'ABSPATH' ) || exit;

use WP_Meta_Query;
use WP_Query;

class Settings {

	const AMAZON_MARKETPLACES = array(
		'au' => array(
			'marketplace' => 'www.amazon.com.au',
			'host'        => 'webservices.amazon.com.au',
			'pa_api_region'      => 'us-west-2',
			'region'      => 'FE',
		),
		'be' => array(
			'marketplace' => 'www.amazon.com.be',
			'host'        => 'webservices.amazon.com.be',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'br' => array(
			'marketplace' => 'www.amazon.com.br',
			'host'        => 'webservices.amazon.com.br',
			'pa_api_region'      => 'us-east-1',
			'region'      => 'NA',
		),
		'ca' => array(
			'marketplace' => 'www.amazon.ca',
			'host'        => 'webservices.amazon.ca',
			'pa_api_region'      => 'us-east-1',
			'region'      => 'NA',
		),
		'eg' => array(
			'marketplace' => 'www.amazon.eg',
			'host'        => 'webservices.amazon.eg',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'fr' => array(
			'marketplace' => 'www.amazon.fr',
			'host'        => 'webservices.amazon.fr',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'de' => array(
			'marketplace' => 'www.amazon.de',
			'host'        => 'webservices.amazon.de',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'ie' => array(
			'marketplace' => 'www.amazon.ie',
			'region'      => 'EU',
		),
		'in' => array(
			'marketplace' => 'www.amazon.in',
			'host'        => 'webservices.amazon.in',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'it' => array(
			'marketplace' => 'www.amazon.it',
			'host'        => 'webservices.amazon.it',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'jp' => array(
			'marketplace' => 'www.amazon.co.jp',
			'host'        => 'webservices.amazon.co.jp',
			'pa_api_region'      => 'us-west-2',
			'region'      => 'FE',
		),
		'mx' => array(
			'marketplace' => 'www.amazon.com.mx',
			'host'        => 'webservices.amazon.com.mx',
			'pa_api_region'      => 'us-east-1',
			'region'      => 'NA',
		),
		'nl' => array(
			'marketplace' => 'www.amazon.nl',
			'host'        => 'webservices.amazon.nl',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'pl' => array(
			'marketplace' => 'www.amazon.pl',
			'host'        => 'webservices.amazon.pl',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'sa' => array(
			'marketplace' => 'www.amazon.sa',
			'host'        => 'webservices.amazon.sa',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'sg' => array(
			'marketplace' => 'www.amazon.sg',
			'host'        => 'webservices.amazon.sg',
			'pa_api_region'      => 'us-west-2',
			'region'      => 'FE',
		),
		'es' => array(
			'marketplace' => 'www.amazon.es',
			'host'        => 'webservices.amazon.es',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'se' => array(
			'marketplace' => 'www.amazon.se',
			'host'        => 'webservices.amazon.se',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'tr' => array(
			'marketplace' => 'www.amazon.com.tr',
			'host'        => 'webservices.amazon.com.tr',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'ae' => array(
			'marketplace' => 'www.amazon.ae',
			'host'        => 'webservices.amazon.ae',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'uk' => array(
			'marketplace' => 'www.amazon.co.uk',
			'host'        => 'webservices.amazon.co.uk',
			'pa_api_region'      => 'eu-west-1',
			'region'      => 'EU',
		),
		'us' => array(
			'marketplace' => 'www.amazon.com',
			'host'        => 'webservices.amazon.com',
			'pa_api_region'      => 'us-east-1',
			'region'      => 'NA',
		),
	);

	const AMAZON_CREDENTIAL_VERSIONs = array(
		'2.1' => array(
			'region'      => 'NA',
			'token_endpoint' => 'https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token',
		),
		'2.2' => array(
			'region'      => 'EU',
			'token_endpoint' => 'https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token',
		),
		'2.3' => array(
			'region'      => 'FE',
			'token_endpoint' => 'https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token',
		),
		'3.1' => array(
			'region'      => 'NA',
			'token_endpoint' => 'https://api.amazon.com/auth/o2/token',
		),
		'3.2' => array(
			'region'      => 'EU',
			'token_endpoint' => 'https://api.amazon.co.uk/auth/o2/token',
		),
		'3.3' => array(
			'region'      => 'FE',
			'token_endpoint' => 'https://api.amazon.co.jp/auth/o2/token',
		),
	);

	/**
	 * Get the Amazon credential version for a given country code.
	 *
	 * @param string $country_code The country code.
	 * @return string The Amazon credential version.
	 */
	public static function get_amazon_default_credential_version( $country_code ) {
		$region = self::AMAZON_MARKETPLACES[ $country_code ]['region'] ?? '';

		foreach ( self::AMAZON_CREDENTIAL_VERSIONs as $version => $info ) {
			if ( $info['region'] === $region ) {
				return $version;
			}
		}

		return '';
	}

	/**
	 * Check if the product is already imported by ASIN.
	 *
	 * @param string $asin The ASIN of the product.
	 * @return bool True if the product is already imported, false otherwise.
	 */
	public static function is_product_already_imported( $asin ) {
		$args = array(
			'post_type'   => 'product',
			'post_status' => 'publish',
			'meta_query'  => array(
				array(
					'key'     => 'affprodimp_product_asin',
					'value'   => $asin,
					'compare' => '=',
				),
			),
		);

		$query = new WP_Query( $args );

		return $query->have_posts();
	}

	/**
	 * Get the Amazon marketplace URL for a given country code.
	 *
	 * @param string $country_code The country code.
	 * @return string The Amazon marketplace URL.
	 */
	public static function get_amazon_marketplace( $country_code ) {
		return self::AMAZON_MARKETPLACES[ $country_code ]['marketplace'] ?? '';
	}

	/**
	 * Get the Amazon host for a given country code.
	 *
	 * @param string $country_code The country code.
	 * @return string The Amazon host.
	 */
	public static function get_amazon_host( $country_code ) {
		return self::AMAZON_MARKETPLACES[ $country_code ]['host'] ?? '';
	}

	/**
	 * Get the Amazon region for a given country code.
	 *
	 * @param string $country_code The country code.
	 * @return string The Amazon region.
	 */
	public static function get_amazon_region( $country_code ) {
		return self::AMAZON_MARKETPLACES[ $country_code ]['pa_api_region'] ?? '';
	}

	/**
	 *
	 */
	public static function get_product_url( $country_code, $affiliate_id, $asin ) {
		$marketplace = self::get_amazon_marketplace( $country_code );
		return esc_url( 'https://' . $marketplace . '/dp/' . $asin . '/?tag=' . $affiliate_id );
	}
}
