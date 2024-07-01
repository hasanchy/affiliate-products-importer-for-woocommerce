<?php
/**
 * Class to boot up plugin.
 *
 * @link    https://themedyno.com/
 * @since   1.0.0
 *
 * @author  AFFIMPORTR (https://themedyno.com)
 * @package AFFIMPORTR_Core
 *
 * @copyright (c) 2024, ThemeDyno (http://themedyno.com)
 */

namespace AFFIMPORTR\Core;

use AFFIMPORTR\Core\Base;
use AFFIMPORTR\App;

// If this file is called directly, abort.
defined( 'WPINC' ) || die;

final class Loader extends Base {
	/**
	 * Settings helper class instance.
	 *
	 * @since 1.0.0
	 * @var object
	 *
	 */
	public $settings;

	/**
	 * Minimum supported php version.
	 *
	 * @since  1.0.0
	 * @var float
	 *
	 */
	public $php_version = '7.4';

	/**
	 * Minimum WordPress version.
	 *
	 * @since  1.0.0
	 * @var float
	 *
	 */
	public $wp_version = '6.1';

	/**
	 * Initialize functionality of the plugin.
	 *
	 * This is where we kick-start the plugin by defining
	 * everything required and register all hooks.
	 *
	 * @since  1.0.0
	 * @access protected
	 * @return void
	 */
	protected function __construct() {
		if ( ! $this->can_boot() ) {
			return;
		}

		$this->init();
	}

	/**
	 * Main condition that checks if plugin parts should continue loading.
	 *
	 * @return bool
	 */
	private function can_boot() {
		/**
		 * Checks
		 *  - PHP version
		 *  - WP Version
		 * If not then return.
		 */
		global $wp_version;

		return (
			version_compare( PHP_VERSION, $this->php_version, '>' ) &&
			version_compare( $wp_version, $this->wp_version, '>' )
		);
	}

	/**
	 * Register all the actions and filters.
	 *
	 * @since  1.0.0
	 * @access private
	 * @return void
	 */
	private function init() {
		App\Admin_Pages\AffiliateImporter::instance()->init();
		// App\Admin_Pages\PixelArt::instance()->init();
		App\Endpoints\V1\Settings::instance();
	}
}
