<?php
/**
 * File Description:
 * Base abstract class to be inherited by other classes
 *
 * @link    https://themedyno.com/
 * @since   1.0.0
 *
 * @author  AFLTIMPTR (https://themedyno.com)
 * @package AFLTIMPTR_Core
 *
 * @copyright (c) 2024, ThemeDyno (http://themedyno.com)
 */

namespace AFLTIMPTR\Core;

use AFLTIMPTR\Core\Singleton;

// Abort if called directly.
defined( 'WPINC' ) || die;

/**
 * Class Base
 *
 * @package AFLTIMPTR\Core
 */
abstract class Base extends Singleton {
	/**
	 * Getter method.
	 *
	 * Allows access to extended site properties.
	 *
	 * @param string $key Property to get.
	 *
	 * @return mixed Value of the property. Null if not available.
	 * @since 1.0.0
	 */
	public function __get( $key ) {
		// If set, get it.
		if ( isset( $this->{$key} ) ) {
			return $this->{$key};
		}

		return null;
	}

	/**
	 * Setter method.
	 *
	 * Set property and values to class.
	 *
	 * @param string $key Property to set.
	 * @param mixed  $value Value to assign to the property.
	 *
	 * @since 1.0.0
	 */
	public function __set( $key, $value ) {
		$this->{$key} = $value;
	}
}
