<?php
/**
 * Affiliate Products Import block.
 */

namespace AFFPRODIMP\App\Admin_Pages;

// Abort if called directly.
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Base;

class AffiliateProductsImporter extends Base {
	/**
	 * The page title.
	 *
	 * @var string
	 */
	private $page_title;

	/**
	 * The page slug.
	 *
	 * @var string
	 */
	private $page_slug = 'affiliate-products-importer-for-woocommerce-admin';

	/**
	 * Page Assets.
	 *
	 * @var array
	 */
	private $page_scripts = array();

	/**
	 * Assets version.
	 *
	 * @var string
	 */
	private $assets_version = '';

	/**
	 * A unique string id to be used in markup and jsx.
	 *
	 * @var string
	 */
	private $unique_id = '';

	/**
	 * Initializes the page.
	 *
	 * @return void
	 * @since 1.0.0
	 *
	 */
	public function init() {
		if ( is_admin() ) {
			$this->page_title     = __( 'Affiliate Products Importer', 'affiliate-products-importer-for-woocommerce' );
			$this->assets_version = ! empty( $this->script_data( 'version' ) ) ? $this->script_data( 'version' ) : AFFPRODIMP_VERSION;
			$this->unique_id      = "affprodimp_affiliateimporter_main_wrap-{$this->assets_version}";

			add_action( 'admin_menu', array( $this, 'register_admin_page' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
			add_filter( 'plugin_action_links_' . AFFPRODIMP_PLUGIN_BASENAME, array( $this, 'add_action_links' ) );
		}
	}

	/**
	 * Add action links to the plugin page.
	 *
	 * @param array $links
	 * @return array
	 */
	public function add_action_links( $links ) {
		$new_links = array(
			'<a href="' . admin_url( 'admin.php?page=' . $this->page_slug ) . '">' . __( 'Import Products', 'affiliate-products-importer-for-woocommerce' ) . '</a>',
		);
		return array_merge( $new_links, $links );
	}

	/**
	 *
	 * SVG icon for menu
	 * @return string
	 * @since 1.0.0
	 *
	 **/
	public function getIcon() {
		// Encode the SVG data for embedding it as a data URI
		$svg = '<svg viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1344 928q0-14-9-23t-23-9h-224v-352q0-13-9.5-22.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 22.5v352h-224q-13 0-22.5 9.5t-9.5 22.5q0 14 9 23l352 352q9 9 23 9t23-9l351-351q10-12 10-24zm640 224q0 159-112.5 271.5t-271.5 112.5h-1088q-185 0-316.5-131.5t-131.5-316.5q0-130 70-240t188-165q-2-30-2-43 0-212 150-362t362-150q156 0 285.5 87t188.5 231q71-62 166-62 106 0 181 75t75 181q0 76-41 138 130 31 213.5 135.5t83.5 238.5z" fill="#fff"/></svg>';
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- This use of base64_encode is safe for embedding SVG data as a data URI
		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}


	public function register_admin_page() {
		$page = add_menu_page(
			$this->page_title,
			__( 'Amazon Products Importer (Lite)', 'affiliate-products-importer-for-woocommerce' ),
			'manage_options',
			$this->page_slug,
			array( $this, 'callback' ),
			$this->getIcon(),
			26
		);

		add_action( 'load-' . $page, array( $this, 'prepare_assets' ) );
	}

	/**
	 * The admin page callback method.
	 *
	 * @return void
	 */
	public function callback() {
		$this->view();
	}

	/**
	 * Prepares assets.
	 *
	 * @return void
	 */
	public function prepare_assets() {
		if ( ! is_array( $this->page_scripts ) ) {
			$this->page_scripts = array();
		}

		$handle       = 'affprodimp_affiliateimporter';
		$src          = AFFPRODIMP_ASSETS_URL . '/js/affiliateimporterpage.min.js';
		$style_src    = AFFPRODIMP_ASSETS_URL . '/css/affiliateimporterpage.min.css';
		$dependencies = ! empty( $this->script_data( 'dependencies' ) )
			? $this->script_data( 'dependencies' )
			: array(
				'react',
				'wp-element',
				'wp-i18n',
				'wp-is-shallow-equal',
				'wp-polyfill',
			);

		$this->page_scripts[ $handle ] = array(
			'src'       => $src,
			'style_src' => $style_src,
			'deps'      => $dependencies,
			'ver'       => $this->assets_version,
			'strategy'  => true,
			'localize'  => array(
				'dom_element_id' => $this->unique_id,
				'restEndpoint'   => array(
					'amazonAPIConnection' => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/amazon-api-connection',
					'product'             => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/product',
					'products'            => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/products',
					'categories'          => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/categories',
					'asinVerification'    => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/asin-verification',
					'import'              => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/import',
					'amazonApiSettings'   => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/amazon-api-settings',
					'importSettings'      => rest_url() . 'affiliate-products-importer-for-woocommerce/v1/import-settings',
				),
				'restNonce'      => wp_create_nonce( 'wp_rest' ),
			),
		);
	}

	/**
	 * Gets assets data for given key.
	 *
	 * @param string $key
	 *
	 * @return string|array
	 */
	protected function script_data( string $key = '' ) {
		$raw_script_data = $this->raw_script_data();

		return ! empty( $key ) && ! empty( $raw_script_data[ $key ] ) ? $raw_script_data[ $key ] : '';
	}

	/**
	 * Gets the script data from assets php file.
	 *
	 * @return array
	 */
	protected function raw_script_data(): array {
		static $script_data = null;

		if ( is_null( $script_data ) && file_exists( AFFPRODIMP_DIR . 'assets/js/affiliateimporterpage.min.asset.php' ) ) {
			$script_data = include AFFPRODIMP_DIR . 'assets/js/affiliateimporterpage.min.asset.php';
		}

		return (array) $script_data;
	}

	/**
	 * Prepares assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		if ( ! empty( $this->page_scripts ) ) {
			foreach ( $this->page_scripts as $handle => $page_script ) {
				wp_register_script(
					$handle,
					$page_script['src'],
					$page_script['deps'],
					$page_script['ver'],
					$page_script['strategy']
				);

				if ( ! empty( $page_script['localize'] ) ) {
					wp_localize_script( $handle, 'affprodimpAffiliateImporter', $page_script['localize'] );
				}

				wp_enqueue_script( $handle );

				if ( ! empty( $page_script['style_src'] ) ) {
					wp_enqueue_style( $handle, $page_script['style_src'], array(), $this->assets_version );
				}

				wp_set_script_translations( $handle, 'affiliate-products-importer-for-woocommerce', AFFPRODIMP_LANGUAGES_DIR );
			}
		}
	}

	/**
	 * Prints the wrapper element which React will use as root.
	 *
	 * @return void
	 */
	protected function view() {
		echo '<div id="' . esc_attr( $this->unique_id ) . '"></div>';
	}
}
