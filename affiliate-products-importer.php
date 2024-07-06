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
if ( ! defined( 'AFLTIMPTR_VERSION' ) ) {
	define( 'AFLTIMPTR_VERSION', '1.0.0' );
}

// Define AFLTIMPTR_PLUGIN_FILE.
if ( ! defined( 'AFLTIMPTR_PLUGIN_FILE' ) ) {
	define( 'AFLTIMPTR_PLUGIN_FILE', __FILE__ );
}

// Plugin directory.
if ( ! defined( 'AFLTIMPTR_DIR' ) ) {
	define( 'AFLTIMPTR_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin basename.
if ( ! defined( 'AFLTIMPTR_PLUGIN_BASENAME' ) ) {
	define( 'AFLTIMPTR_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}

// Languages directory.
if ( ! defined( 'AFLTIMPTR_LANGUAGES_DIR' ) ) {
	define( 'AFLTIMPTR_LANGUAGES_DIR', AFLTIMPTR_DIR . '/languages' );
}

// Plugin url.
if ( ! defined( 'AFLTIMPTR_URL' ) ) {
	define( 'AFLTIMPTR_URL', plugin_dir_url( __FILE__ ) );
}

// Assets url.
if ( ! defined( 'AFLTIMPTR_ASSETS_URL' ) ) {
	define( 'AFLTIMPTR_ASSETS_URL', AFLTIMPTR_URL . '/assets' );
}

/**
 * AFLTIMPTR_AffiliateImporter class.
 */
class AFLTIMPTR_AffiliateImporter {

	/**
	 * Holds the class instance.
	 *
	 * @var AFLTIMPTR_AffiliateImporter $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class
	 *
	 * Return an instance of the AFLTIMPTR_AffiliateImporter Class.
	 *
	 * @return AFLTIMPTR_AffiliateImporter class instance.
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

		AFLTIMPTR\Core\Loader::instance();
	}
}

// Init the plugin and load the plugin instance for the first time.
add_action(
	'plugins_loaded',
	function () {
		AFLTIMPTR_AffiliateImporter::get_instance()->load();
	}
);
