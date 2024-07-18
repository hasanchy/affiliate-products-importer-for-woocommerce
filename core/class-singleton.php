<?php
/**
 * Singleton class for all classes.
 *
 * @link    https://themedyno.com/
 * @since   1.0.0
 *
 * @author  AFFPRODSIMP (https://themedyno.com)
 * @package AFFPRODSIMP_Core
 *
 * @copyright (c) 2024, ThemeDyno (http://themedyno.com)
 */

namespace AFFPRODSIMP\Core;

// Abort if called directly.
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

/**
 * Class Singleton
 *
 * @package AFFPRODSIMP\Core
 */
abstract class Singleton {

	/**
	 * Singleton constructor.
	 *
	 * Protect the class from being initiated multiple times.
	 *
	 * @param array $props Optional properties array.
	 *
	 * @since 1.0.0
	 */
	protected function __construct( $props = array() ) {
		// Protect class from being initiated multiple times.
	}

	/**
	 * Instance obtaining method.
	 *
	 * @return static Called class instance.
	 * @since 1.0.0
	 */
	public static function instance() {
		static $instances = array();

		// @codingStandardsIgnoreLine Plugin-backported
		$called_class_name = get_called_class();

		if ( ! isset( $instances[ $called_class_name ] ) ) {
			$instances[ $called_class_name ] = new $called_class_name();
		}

		return $instances[ $called_class_name ];
	}
}
