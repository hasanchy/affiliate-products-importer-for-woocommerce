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
			'region'      => 'us-west-2',
		),
		'be' => array(
			'marketplace' => 'www.amazon.com.be',
			'host'        => 'webservices.amazon.com.be',
			'region'      => 'eu-west-1',
		),
		'br' => array(
			'marketplace' => 'www.amazon.com.br',
			'host'        => 'webservices.amazon.com.br',
			'region'      => 'us-east-1',
		),
		'ca' => array(
			'marketplace' => 'www.amazon.ca',
			'host'        => 'webservices.amazon.ca',
			'region'      => 'us-east-1',
		),
		'cn' => array(
			'marketplace' => 'www.amazon.cn',
			'host'        => 'webservices.amazon.cn',
			'region'      => 'us-west-2',
		),
		'eg' => array(
			'marketplace' => 'www.amazon.eg',
			'host'        => 'webservices.amazon.eg',
			'region'      => 'eu-west-1',
		),
		'fr' => array(
			'marketplace' => 'www.amazon.fr',
			'host'        => 'webservices.amazon.fr',
			'region'      => 'eu-west-1',
		),
		'de' => array(
			'marketplace' => 'www.amazon.de',
			'host'        => 'webservices.amazon.de',
			'region'      => 'eu-west-1',
		),
		'in' => array(
			'marketplace' => 'www.amazon.in',
			'host'        => 'webservices.amazon.in',
			'region'      => 'eu-west-1',
		),
		'it' => array(
			'marketplace' => 'www.amazon.it',
			'host'        => 'webservices.amazon.it',
			'region'      => 'eu-west-1',
		),
		'jp' => array(
			'marketplace' => 'www.amazon.co.jp',
			'host'        => 'webservices.amazon.co.jp',
			'region'      => 'us-west-2',
		),
		'mx' => array(
			'marketplace' => 'www.amazon.com.mx',
			'host'        => 'webservices.amazon.com.mx',
			'region'      => 'us-east-1',
		),
		'nl' => array(
			'marketplace' => 'www.amazon.nl',
			'host'        => 'webservices.amazon.nl',
			'region'      => 'eu-west-1',
		),
		'pl' => array(
			'marketplace' => 'www.amazon.pl',
			'host'        => 'webservices.amazon.pl',
			'region'      => 'eu-west-1',
		),
		'sa' => array(
			'marketplace' => 'www.amazon.sa',
			'host'        => 'webservices.amazon.sa',
			'region'      => 'eu-west-1',
		),
		'sg' => array(
			'marketplace' => 'www.amazon.sg',
			'host'        => 'webservices.amazon.sg',
			'region'      => 'us-west-2',
		),
		'es' => array(
			'marketplace' => 'www.amazon.es',
			'host'        => 'webservices.amazon.es',
			'region'      => 'eu-west-1',
		),
		'se' => array(
			'marketplace' => 'www.amazon.se',
			'host'        => 'webservices.amazon.se',
			'region'      => 'eu-west-1',
		),
		'tr' => array(
			'marketplace' => 'www.amazon.com.tr',
			'host'        => 'webservices.amazon.com.tr',
			'region'      => 'eu-west-1',
		),
		'ae' => array(
			'marketplace' => 'www.amazon.ae',
			'host'        => 'webservices.amazon.ae',
			'region'      => 'eu-west-1',
		),
		'us' => array(
			'marketplace' => 'www.amazon.com',
			'host'        => 'webservices.amazon.com',
			'region'      => 'us-east-1',
		),
		'gb' => array(
			'marketplace' => 'www.amazon.co.uk',
			'host'        => 'webservices.amazon.co.uk',
			'region'      => 'eu-west-1',
		),
	);

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
		return self::AMAZON_MARKETPLACES[ $country_code ]['region'] ?? '';
	}

	/**
	 *
	 */
	public static function get_product_url( $country_code, $affiliate_id, $asin ) {
		$marketplace = self::get_amazon_marketplace( $country_code );
		return esc_url( 'https://' . $marketplace . '/dp/' . $asin . '/?tag=' . $affiliate_id );
	}
}
