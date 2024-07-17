<?php
/**
 * Google Auth block.
 *
 * @link          https://themedyno.com/
 * @since         1.0.0
 *
 * @author        AFFPRODSIMP (https://themedyno.com)
 * @package       AFFPRODSIMP\App
 *
 * @copyright (c) 2024, ThemeDyno (http://themedyno.com)
 */

namespace AFFPRODSIMP\App\WooCommerce;

// Abort if called directly.
defined( 'WPINC' ) || die;

use AFFPRODSIMP\Core\Base;

class WooCommerceIntegration extends Base {

	public $image_meta_url   = '_azoncom_product_img_url';
	public $gallery_meta_url = '_azoncom_product_gallery_url';

	/**
	 * Initializes the page.
	 *
	 * @return void
	 * @since 1.0.0
	 *
	 */
	public function init() {
		\add_filter( 'woocommerce_get_price_html', array( $this, 'amz_disclaimer_price_html' ), 100, 2 );

		\add_filter( 'wp_get_attachment_image_src', array( $this, 'azoncom_replace_attachment_image_src' ), 100, 2 );

		add_filter( 'woocommerce_product_get_gallery_image_ids', array( $this, 'azoncom_set_customized_gallary_ids' ), 99, 2 );
		add_filter( 'woocommerce_product_get_image_id', array( $this, 'azoncom_woocommerce_product_get_image_id_support' ), 99, 2 );
	}

	public function amz_disclaimer_price_html( $price, $product ) {

		if ( ! is_product() || ! $product->get_price() ) {
			return $price;
		}
		$prod_id = 0;
		if ( is_object( $product ) ) {
			if ( method_exists( $product, 'get_id' ) ) {
				$prod_id = (int) $product->get_id();
			} elseif ( isset( $product->id ) && (int) $product->id > 0 ) {
				$prod_id = (int) $product->id;
			}
		}

		$post_id = $prod_id;
		if ( $post_id <= 0 ) {
			return $price;
		}

		$price_update_date_db = get_post_meta( $post_id, '_azoncom_sync_last_date', true );
		// product not synced at least once yet! - bug solved 2015-11-03
		if ( empty( $price_update_date_db ) ) {
			global $post;
			$price_update_date_db = strtotime( $post->post_date ); //$product->post->post_date
		}
		$price_update_date = $price_update_date_db;

		// $price_update_date = date('Y-m-d', time());
		$price_update_date = new \DateTime( "@$price_update_date" );
		$price_update_date->setTimezone( new \DateTimeZone( 'America/Los_Angeles' ) );
		$date_format        = isset( $this->amz_settings['asof_date_format'] ) && $this->amz_settings['asof_date_format'] != '' ? $this->amz_settings['asof_date_format'] : 'd/m/Y H:i';
		$price_update_date  = $price_update_date->format( $date_format );
		$price_update_date .= ' PST';

		return $price . " (as of $price_update_date)";
	}

	public function azoncom_replace_attachment_image_src( $image, $attachment_id, $size = '', $icon = '' ) {
		if ( false !== strpos( $attachment_id, 'azoncom_gallery_images' ) ) {
			$attachment = explode( '__', $attachment_id );
			$image_num  = $attachment[1];
			$product_id = $attachment[2];
			if ( $product_id > 0 ) {
				$gallery_images = $this->get_product_gallery_url( $product_id );
				if ( ! empty( $gallery_images ) ) {
					$url = $gallery_images[ $image_num ];
					if ( $url ) {
						return array( $url, 800, 600, false );
					}
				}
			}
		}

		if ( is_numeric( $attachment_id ) && $attachment_id > 0 ) {
			$image_data = $this->azoncom_get_image_meta( $attachment_id, true );
			if ( isset( $image_data['img_url'] ) && $image_data['img_url'] != '' ) {
				$image_url = $image_data['img_url'];
				if ( $image_url ) {
					// Return the image array with URL and empty values for width, height, and icon.
					return array( $image_url, 800, 600, false );
				}
			}
		}

		return $image;
	}

	function azoncom_set_customized_gallary_ids( $value, $product ) {

		$product_id = $product->get_id();
		if ( empty( $product_id ) ) {
			return $value;
		}
		$gallery_images = $this->get_product_gallery_url( $product_id );
		if ( ! empty( $gallery_images ) ) {
			$i = 0;
			foreach ( $gallery_images as $gallery_image ) {
				$gallery_ids[] = 'azoncom_gallery_images__' . $i . '__' . $product_id;
				++$i;
			}
			return $gallery_ids;
		}
		return $value;
	}

	function azoncom_woocommerce_product_get_image_id_support( $value, $product ) {
		$product_id = $product->get_id();
		$img_url    = ! empty( $product_id ) ? $this->get_product_img_url( $product_id ) : '';
		if ( ! empty( $img_url ) ) {
			return $product_id;
		}
		return $value;
	}

	public function get_product_img_url( $id ) {
		$value = get_post_meta( $id, '_azoncom_product_img_url', true );

		if ( $value ) {
			return $value;
		}

		return '';
	}

	public function get_product_gallery_url( $id ) {
		$value = get_post_meta( $id, '_azoncom_product_gallery_url', true );

		if ( $value ) {
			return $value;
		}

		return array();
	}

	public function azoncom_get_image_meta( $post_id, $is_single_page = false ) {
		$img_url               = get_post_meta( $post_id, $this->image_meta_url, true );
		$image_meta['img_url'] = $img_url;
		return $image_meta;
	}
}
