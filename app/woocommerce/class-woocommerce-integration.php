<?php
/**
 * WooCommerce integration
 */

namespace AFFPRODIMP\App\WooCommerce;

// Abort if called directly.
defined( 'ABSPATH' ) || die( 'No direct access allowed!' );

use AFFPRODIMP\Core\Base;

class WooCommerceIntegration extends Base {

	public $image_meta_url   = 'affprodimp_product_img_url';
	public $gallery_meta_url = 'affprodimp_product_gallery_url';

	/**
	 * Initializes the page.
	 *
	 * @return void
	 * @since 1.0.0
	 *
	 */
	public function init() {

		\add_filter( 'wp_get_attachment_image_src', array( $this, 'affprodimp_replace_attachment_image_src' ), 100, 2 );

		add_filter( 'woocommerce_product_get_gallery_image_ids', array( $this, 'affprodimp_set_customized_gallary_ids' ), 99, 2 );
		add_filter( 'woocommerce_product_get_image_id', array( $this, 'affprodimp_woocommerce_product_get_image_id_support' ), 99, 2 );

		add_action( 'wp', array( $this, 'remove_woo_image_effects' ) );
	}

	public function remove_woo_image_effects() {
		if ( is_product() ) {
			global $post;

			// Check if the post is a product and get the product ID
			if ( 'product' === $post->post_type ) {
				$product_id = $post->ID;

				// Get the thumbnail URL from the options table
				$thumbnail_url = get_post_meta( $product_id, 'affprodimp_product_img_url', true );

				// Ensure the URL exists for this specific product ID
				if ( $thumbnail_url ) {
					// Remove WooCommerce image effects
					remove_theme_support( 'wc-product-gallery-zoom' );
				}
			}
		}
	}

	public function affprodimp_replace_attachment_image_src( $image, $attachment_id, $size = '', $icon = '' ) {
		if ( false !== strpos( $attachment_id, 'affprodimp_gallery_images' ) ) {
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
			$image_data = $this->affprodimp_get_image_meta( $attachment_id, true );
			if ( isset( $image_data['img_url'] ) && ! empty( $image_data['img_url'] ) ) {
				$image_url = $image_data['img_url'];
				if ( $image_url ) {
					// Return the image array with URL and empty values for width, height, and icon.
					return array( $image_url, 800, 600, false );
				}
			}
		}

		return $image;
	}

	public function affprodimp_set_customized_gallary_ids( $value, $product ) {

		$product_id = $product->get_id();
		if ( empty( $product_id ) ) {
			return $value;
		}
		$gallery_images = $this->get_product_gallery_url( $product_id );
		if ( ! empty( $gallery_images ) ) {
			$i = 0;
			foreach ( $gallery_images as $gallery_image ) {
				$gallery_ids[] = 'affprodimp_gallery_images__' . $i . '__' . $product_id;
				++$i;
			}
			return $gallery_ids;
		}
		return $value;
	}

	public function affprodimp_woocommerce_product_get_image_id_support( $value, $product ) {
		$product_id = $product->get_id();
		$img_url    = ! empty( $product_id ) ? $this->get_product_img_url( $product_id ) : '';
		if ( ! empty( $img_url ) ) {
			return $product_id;
		}
		return $value;
	}

	public function get_product_img_url( $id ) {
		$value = get_post_meta( $id, 'affprodimp_product_img_url', true );

		if ( $value ) {
			return $value;
		}

		return '';
	}

	public function get_product_gallery_url( $id ) {
		$value = get_post_meta( $id, 'affprodimp_product_gallery_url', true );

		if ( $value ) {
			return $value;
		}

		return array();
	}

	public function affprodimp_get_image_meta( $post_id, $is_single_page = false ) {
		$img_url               = get_post_meta( $post_id, $this->image_meta_url, true );
		$image_meta['img_url'] = $img_url;
		return $image_meta;
	}
}
