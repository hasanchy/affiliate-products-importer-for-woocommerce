<?php

namespace AFFPRODIMP\Core;

use AFFPRODIMP\Core\Settings;

/**
 * Class ProductDataHandler
 *
 * @codingStandardsIgnoreStart
 */
class ProductDataHandler {
	public static function process_items( $items, $country_code, $affiliate_id ) {
		$fetch_result = array();

		foreach ( $items as $index => $item ) {
			$asin                           = esc_html( $item->ASIN );
			$fetch_result[ $index ]['asin'] = $asin;
			$fetch_result[ $index ]['is_already_imported'] = Settings::is_product_already_imported( $asin );
			$post_title                                    = esc_html( $item->ItemInfo->Title->DisplayValue );
			$fetch_result[ $index ]['post_title']          = $post_title;
			$fetch_result[ $index ]['post_name']           = sanitize_title( $post_title );
			$features                                      = isset( $item->ItemInfo->Features->DisplayValues ) ? $item->ItemInfo->Features->DisplayValues : array($post_title);
			if( !empty( $features ) ){
				$fetch_result[ $index ]['post_content']    = '<ul><li>' . implode( '</li><li>', array_map( array( __CLASS__, 'convert_to_plain_text' ), $features ) ) . '</li></ul>';
			}
			$fetch_result[ $index ]['image_primary']       = esc_url( $item->Images->Primary->Large->URL );

			$image_variants = array();
			if(isset($item->Images->Variants)){
				foreach ($item->Images->Variants as $image) {
					$image_variants[] = esc_url( $image->Large->URL );
				}
			}
			$fetch_result[$index]['image_variants'] = $image_variants;

			if ( isset( $item->Offers->Listings[0]->SavingBasis->Amount ) ) {
				$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->Offers->Listings[0]->SavingBasis->Amount ), 2 );
				$fetch_result[ $index ]['sale_price']    = number_format( floatval( $item->Offers->Listings[0]->Price->Amount ), 2 );
			} elseif ( isset( $item->Offers->Listings[0]->Price->Amount ) ) {
					$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->Offers->Listings[0]->Price->Amount ), 2, '.', '' );
			} else {
				$fetch_result[ $index ]['regular_price'] = '';
			}

			$fetch_result[ $index ]['product_url'] = Settings::get_product_url( $country_code, $affiliate_id, $asin );
			$fetch_result[ $index ]['attributes'] = self::process_attribute( $item );
		}

		return $fetch_result;
	}

	public static function process_attribute( $item ){
		$attributes = array();
		$ManufactureInfo = isset($item->ItemInfo->ManufactureInfo) ? $item->ItemInfo->ManufactureInfo : false;
		$ByLineInfo = isset($item->ItemInfo->ByLineInfo) ? $item->ItemInfo->ByLineInfo : false;
		$ProductInfo = isset($item->ItemInfo->ProductInfo) ? $item->ItemInfo->ProductInfo : false;
		$Classifications = isset($item->ItemInfo->Classifications) ? $item->ItemInfo->Classifications : false;

		if( isset($ByLineInfo->Brand) ){
			$attributes[] = array(
				'name'=> 'Brand',
				'value'=> esc_html( $ByLineInfo->Brand->DisplayValue )
			);
		}

		if( isset($ByLineInfo->Manufacturer) ){
			$attributes[] = array(
				'name'=> 'Manufacturer',
				'value'=> esc_html( $ByLineInfo->Manufacturer->DisplayValue )
			);
		}

		if( isset($Classifications->Binding) ){
			$attributes[] = array(
				'name'=> 'Binding',
				'value'=> esc_html( $Classifications->Binding->DisplayValue )
			);
		}

		if( isset($ManufactureInfo->Model) ){
			$attributes[] = array(
				'name'=> 'Model',
				'value'=> esc_html( $ManufactureInfo->Model->DisplayValue )
			);
		}

		if( isset($ByLineInfo->Color) || isset($ProductInfo->Color) ){
			$color = isset($ByLineInfo->Color) ? $ByLineInfo->Color->DisplayValue : $ProductInfo->Color->DisplayValue;
			$attributes[] = array(
				'name'=> 'Color',
				'value'=> esc_html( $color )
			);
		}

		if( isset($ProductInfo->ItemDimensions->Width) ){
			$unit = isset($ProductInfo->ItemDimensions->Width->Unit) ? $ProductInfo->ItemDimensions->Width->Unit : '';
			$attributes[] = array(
				'name'=> 'Width',
				'value'=> esc_html( $ProductInfo->ItemDimensions->Width->DisplayValue . " " . $unit )
			);
		}

		if( isset($ProductInfo->ItemDimensions->Height) ){
			$unit = isset($ProductInfo->ItemDimensions->Height->Unit) ? $ProductInfo->ItemDimensions->Height->Unit : '';
			$attributes[] = array(
				'name'=> 'Height',
				'value'=> esc_html( $ProductInfo->ItemDimensions->Height->DisplayValue . " " . $unit )
			);
		}

		if( isset($ProductInfo->ItemDimensions->Length) ){
			$unit = isset($ProductInfo->ItemDimensions->Length->Unit) ? $ProductInfo->ItemDimensions->Length->Unit : '';
			$attributes[] = array(
				'name'=> 'Length',
				'value'=> esc_html( $ProductInfo->ItemDimensions->Length->DisplayValue . " " . $unit )
			);
		}

		if( isset($ProductInfo->ItemDimensions->Weight) ){
			$unit = isset($ProductInfo->ItemDimensions->Weight->Unit) ? $ProductInfo->ItemDimensions->Weight->Unit : '';
			$attributes[] = array(
				'name'=> 'Item Weight',
				'value'=> esc_html( $ProductInfo->ItemDimensions->Weight->DisplayValue . ' ' . $unit )
			);
		}

		if( isset($ProductInfo->Size) ){
			$attributes[] = array(
				'name'=> 'Size',
				'value'=> esc_html( $ProductInfo->Size->DisplayValue )
			);
		}

		return $attributes;
	}

	public static function convert_to_plain_text( $text ) {
		// First, escape the text for safe HTML output
		$escaped_text = esc_html( $text );
	
		// Use iconv to convert special characters to plain ASCII, if possible
		$converted_text = iconv('UTF-8', 'ASCII//TRANSLIT', $escaped_text);
	
		// If iconv fails, return the original escaped text
		if ($converted_text === false) {
			return $escaped_text;
		}
	
		return $converted_text;
	}
}
/**
 * @codingStandardsIgnoreEnd
 */
