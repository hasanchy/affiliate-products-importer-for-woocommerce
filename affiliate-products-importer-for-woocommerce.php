<?php
/**
 * Main file for WordPress.
 *
 * @wordpress-plugin
 * Plugin Name:     Affiliate Products Importer for WooCommerce
 * Description:     Easily import Amazon affiliate products into your WooCommerce store.
 * Author:          ThemeDyno
 * Author URI:      https://themedyno.com/
 * Version:         1.1.1
 * Text Domain:     affiliate-products-importer-for-woocommerce
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
	 * @return AFFPRODIMP_AffiliateImporter class instance.
	 * @since 1.0.0
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Class constructor.
	 */
	private function __construct() {
		add_action( 'plugins_loaded', array( $this, 'load' ) );
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		add_action( 'admin_init', array( $this, 'redirect_after_activation' ) );
	}

	/**
	 * Class initializer.
	 */
	public function load() {
		load_plugin_textdomain(
			'affiliate-products-importer-for-woocommerce',
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/languages'
		);

		AFFPRODIMP\Core\Loader::instance();
	}

	/**
	 * Activation hook callback.
	 */
	public function activate() {
		set_transient( 'affprodimp_activation_redirect', true, 30 );
	}

	/**
	 * Redirect function after activation.
	 */
	public function redirect_after_activation() {
		if ( get_transient( 'affprodimp_activation_redirect' ) ) {
			delete_transient( 'affprodimp_activation_redirect' );
			wp_safe_redirect( esc_url_raw( admin_url( 'admin.php?page=affiliate-products-importer-for-woocommerce-admin' ) ) );
			exit;
		}
	}
}

// Init the plugin and load the plugin instance
AFFPRODIMP_AffiliateImporter::get_instance();
