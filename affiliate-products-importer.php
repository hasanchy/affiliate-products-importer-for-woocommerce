<?php
/**
 * Main file for WordPress.
 *
 * @wordpress-plugin
 * Plugin Name:     Affiliate Products Importer for WooCommerce
 * Description:     Easily import Amazon affiliate products into your WooCommerce store.
 * Author:          ThemeDyno
 * Author URI:      https://themedyno.com/
 * Version:         1.0.2
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
if ( ! defined( 'AFFPRODIMP_VERSION' ) ) {
	define( 'AFFPRODIMP_VERSION', '1.0.2' );
}

// Define AFFPRODIMP_PLUGIN_FILE.
if ( ! defined( 'AFFPRODIMP_PLUGIN_FILE' ) ) {
	define( 'AFFPRODIMP_PLUGIN_FILE', __FILE__ );
}

// Plugin directory.
if ( ! defined( 'AFFPRODIMP_DIR' ) ) {
	define( 'AFFPRODIMP_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin basename.
if ( ! defined( 'AFFPRODIMP_PLUGIN_BASENAME' ) ) {
	define( 'AFFPRODIMP_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}

// Languages directory.
if ( ! defined( 'AFFPRODIMP_LANGUAGES_DIR' ) ) {
	define( 'AFFPRODIMP_LANGUAGES_DIR', AFFPRODIMP_DIR . '/languages' );
}

// Plugin url.
if ( ! defined( 'AFFPRODIMP_URL' ) ) {
	define( 'AFFPRODIMP_URL', plugin_dir_url( __FILE__ ) );
}

// Assets url.
if ( ! defined( 'AFFPRODIMP_ASSETS_URL' ) ) {
	define( 'AFFPRODIMP_ASSETS_URL', AFFPRODIMP_URL . '/assets' );
}

/**
 * AFFPRODIMP_AffiliateImporter class.
 */
class AFFPRODIMP_AffiliateImporter {

	/**
	 * Holds the class instance.
	 *
	 * @var AFFPRODIMP_AffiliateImporter $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class
	 *
	 * Return an instance of the AFFPRODIMP_AffiliateImporter Class.
	 *
	 * @return AFFPRODIMP_AffiliateImporter class instance.
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

		AFFPRODIMP\Core\Loader::instance();
	}
}

// Init the plugin and load the plugin instance for the first time.
add_action(
	'plugins_loaded',
	function () {
		AFFPRODIMP_AffiliateImporter::get_instance()->load();
	}
);
