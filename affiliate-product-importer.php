<?php
/**
 * Main file for WordPress.
 *
 * @wordpress-plugin
 * Plugin Name:     AffiliateImporter - Affiliate Product Importer for WooCommerce
 * Description:     A WordPress plugin that allows users to draw and display pixel art on their website.
 * Author:          ThemeDyno
 * Author URI:      https://themedyno.com/
 * Version:         1.0.1
 * Text Domain:     affiliate-product-importer
 * Domain Path:     /languages
 *
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || die( 'No direct access allowed!' ); // Avoid direct file request

define( 'AFFIMPORTR_FILE', __FILE__ );
define( 'AFFIMPORTR_PATH', dirname( AFFIMPORTR_FILE ) );

// Support for site-level autoloading.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

// Plugin version.
if ( ! defined( 'APIWOOCOM_VERSION' ) ) {
	define( 'AFFIMPORTR_VERSION', '1.0.0' );
}

// Define AFFIMPORTR_PLUGIN_FILE.
if ( ! defined( 'AFFIMPORTR_PLUGIN_FILE' ) ) {
	define( 'AFFIMPORTR_PLUGIN_FILE', __FILE__ );
}

// Plugin directory.
if ( ! defined( 'AFFIMPORTR_DIR' ) ) {
	define( 'AFFIMPORTR_DIR', plugin_dir_path( __FILE__ ) );
}

// Languages directory.
if ( ! defined( 'AFFIMPORTR_LANGUAGES_DIR' ) ) {
	define( 'AFFIMPORTR_LANGUAGES_DIR', AFFIMPORTR_DIR . '/languages' );
}

// Plugin url.
if ( ! defined( 'AFFIMPORTR_URL' ) ) {
	define( 'AFFIMPORTR_URL', plugin_dir_url( __FILE__ ) );
}

// Assets url.
if ( ! defined( 'AFFIMPORTR_ASSETS_URL' ) ) {
	define( 'AFFIMPORTR_ASSETS_URL', AFFIMPORTR_URL . '/assets' );
}


/**
 * AFFIMPORTR_PluginTest class.
 */
class AFFIMPORTR_WPPluginBoilerplate {

	/**
	 * Holds the class instance.
	 *
	 * @var AFFIMPORTR_PluginTest $instance
	 */
	private static $instance = null;

	/**
	 * Return an instance of the class
	 *
	 * Return an instance of the AFFIMPORTR_PluginTest Class.
	 *
	 * @return AFFIMPORTR_PluginTest class instance.
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
			'affiliate-product-importer',
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/languages'
		);

		AFFIMPORTR\Core\Loader::instance();
	}
}

// Init the plugin and load the plugin instance for the first time.
add_action(
	'plugins_loaded',
	function () {
		AFFIMPORTR_WPPluginBoilerplate::get_instance()->load();
	}
);
