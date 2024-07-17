<?php
/**
 * Main file for WordPress.
 *
 * @wordpress-plugin
 * Plugin Name:     Affiliate Importer - Affiliate Products Importer for WooCommerce
 * Description:     Easily import Amazon affiliate products into your WooCommerce store.
 * Author:          ThemeDyno
 * Author URI:      https://themedyno.com/
 * Version:         1.0.1
 * Text Domain:     affiliate-products-importer
 * Domain Path:     /languages
 *
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Avoid direct file request
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

// Support for site-level autoloading.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

// Plugin version.
if ( ! defined( 'AFFPRODSIMP_VERSION' ) ) {
	define( 'AFFPRODSIMP_VERSION', '1.0.0' );
}

// Define AFFPRODSIMP_PLUGIN_FILE.
if ( ! defined( 'AFFPRODSIMP_PLUGIN_FILE' ) ) {
	define( 'AFFPRODSIMP_PLUGIN_FILE', __FILE__ );
}

// Plugin directory.
if ( ! defined( 'AFFPRODSIMP_DIR' ) ) {
	define( 'AFFPRODSIMP_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin basename.
if ( ! defined( 'AFFPRODSIMP_PLUGIN_BASENAME' ) ) {
	define( 'AFFPRODSIMP_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}

// Languages directory.
if ( ! defined( 'AFFPRODSIMP_LANGUAGES_DIR' ) ) {
	define( 'AFFPRODSIMP_LANGUAGES_DIR', AFFPRODSIMP_DIR . '/languages' );
}

// Plugin url.
if ( ! defined( 'AFFPRODSIMP_URL' ) ) {
	define( 'AFFPRODSIMP_URL', plugin_dir_url( __FILE__ ) );
}

// Assets url.
if ( ! defined( 'AFFPRODSIMP_ASSETS_URL' ) ) {
	define( 'AFFPRODSIMP_ASSETS_URL', AFFPRODSIMP_URL . '/assets' );
}

/**
 * AFFPRODSIMP_AffiliateImporter class.
 */
class AFFPRODSIMP_AffiliateImporter {

	/**
	 * Holds the class instance.
	 *
	 * @var AFFPRODSIMP_AffiliateImporter $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class
	 *
	 * Return an instance of the AFFPRODSIMP_AffiliateImporter Class.
	 *
	 * @return AFFPRODSIMP_AffiliateImporter class instance.
	 * @since 1.0.0
	 *
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Class initializer.
	 */
	public function load() {
		load_plugin_textdomain(
			'affiliate-products-importer',
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/languages'
		);

		AFFPRODSIMP\Core\Loader::instance();
	}
}

// Init the plugin and load the plugin instance for the first time.
add_action(
	'plugins_loaded',
	function () {
		AFFPRODSIMP_AffiliateImporter::get_instance()->load();
	}
);
