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

		$import_out_of_stock_products = get_option( 'affprodimp_settings_out_of_stock_products', 'no' );

		foreach ( $items as $index => $item ) {
			$asin                           = esc_html( $item->asin );
            $is_already_imported = Settings::is_product_already_imported( $asin );
			$fetch_result[ $index ]['asin'] = $asin;
			$fetch_result[ $index ]['is_already_imported'] = $is_already_imported;
			$post_title                                    = esc_html( $item->itemInfo->title->displayValue );
			$fetch_result[ $index ]['post_title']          = $post_title;
			$fetch_result[ $index ]['post_name']           = sanitize_title( $post_title );
			$features                                      = isset( $item->itemInfo->features->displayValues ) ? $item->itemInfo->features->displayValues : array($post_title);
			if( !empty( $features ) ){
				$fetch_result[ $index ]['post_content']    = '<ul><li>' . implode( '</li><li>', array_map( array( __CLASS__, 'convert_to_plain_text' ), $features ) ) . '</li></ul>';
				$fetch_result[ $index ]['post_excerpt']    = self::convert_to_plain_sentence( $features[0] );
			}
			$fetch_result[ $index ]['image_primary']       = isset( $item->images->primary->hiRes->url ) ? esc_url( $item->images->primary->hiRes->url ) : esc_url( $item->images->primary->large->url );

			$image_variants = array();
			if(isset($item->images->variants)){
				foreach ($item->images->variants as $image) {
					$image_variants[] = esc_url( $image->large->url );
				}
			}
			$fetch_result[$index]['image_variants'] = $image_variants;

			if( isset( $item->offersV2->listings[0]->price->savingBasis->money->amount ) ){
				$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->offersV2->listings[0]->price->savingBasis->money->amount ), 2, '.', '' );
				$fetch_result[ $index ]['sale_price']    = number_format( floatval( $item->offersV2->listings[0]->price->money->amount ), 2, '.', '' );
			}else if( isset( $item->offersV2->listings[0]->price->money->amount ) ){
				$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->offersV2->listings[0]->price->money->amount ), 2, '.', '' );
			}else{
				$fetch_result[ $index ]['regular_price'] = '';
			}

            if ( ! empty( $fetch_result[ $index ]['regular_price'] ) || ! empty( $fetch_result[ $index ]['sale_price'] ) ) {
                $regular_price = floatval( $fetch_result[ $index ]['regular_price'] );
                $sale_price    = ! empty( $fetch_result[ $index ]['sale_price'] ) ? floatval( $fetch_result[ $index ]['sale_price'] ) : null;
            
                if ( $sale_price && $sale_price < $regular_price ) {
                    // Generate HTML for sale price
                    $price_html = sprintf(
                        '<del>%s</del> <ins>%s</ins>',
                        wc_price( $regular_price ),
                        wc_price( $sale_price )
                    );
                } else {
                    // Generate HTML for regular price only
                    $price_html = wc_price( $regular_price );
                }

                $fetch_result[ $index ]['price_html'] = \esc_html( $price_html );
            }else{
                $fetch_result[ $index ]['price_html'] = "";
            }           

            $stock_status = ( ( isset( $item->offersV2->listings[0]->availability->message ) &&  stristr( $item->offersV2->listings[0]->availability->message, 'out of stock' ) ) || ( isset( $item->offersV2->listings[0]->availability->type ) && $item->offersV2->listings[0]->availability->type === 'OUT_OF_STOCK' ) ) ? 'outofstock' : 'instock';
			$fetch_result[ $index ]['stock_status'] = $stock_status;
            
			if( isset( $item->offersV2->listings[0]->condition->value ) ){
				$fetch_result[ $index ]['condition'] = $item->offersV2->listings[0]->condition->value;
			}

			$fetch_result[ $index ]['product_url'] = Settings::get_product_url( $country_code, $affiliate_id, $asin );
			$fetch_result[ $index ]['attributes'] = self::process_attribute( $item );
            
			$fetch_result[ $index ]['import_status'] = ($is_already_imported) ? 'alreadyimported' : $stock_status;
			$fetch_result[ $index ]['is_importable'] = (!$is_already_imported && ($stock_status=== 'instock' || $import_out_of_stock_products === 'yes') ) ? true : false;


		}

		return $fetch_result;
	}

	public static function process_attribute( $item ) {
		$attributes = array();
	
		if ( ! isset( $item->itemInfo ) || ! is_object( $item->itemInfo ) ) {
			return $attributes;
		}

		$byLineInfo = isset($item->itemInfo->byLineInfo) ? $item->itemInfo->byLineInfo : false;

		if( isset($byLineInfo->brand) ){
			$attributes[] = array(
				'name'=> esc_html__( 'Brand', 'affiliate-products-importer-for-woocommerce' ),
				'value'=> esc_html( $byLineInfo->brand->displayValue )
			);
		}
		
		if( isset($byLineInfo->manufacturer) ){
			$attributes[] = array(
				'name'=> esc_html__( 'Manufacturer', 'affiliate-products-importer-for-woocommerce' ),
				'value'=> esc_html( $byLineInfo->manufacturer->displayValue )
			);
		}
	
		return $attributes;
	}

	public static function process_items_pa_api( $items, $country_code, $affiliate_id ) {
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

			if( isset( $item->OffersV2->Listings[0]->Price->SavingBasis->Money->Amount ) ){
				$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->OffersV2->Listings[0]->Price->SavingBasis->Money->Amount ), 2, '.', '' );
				$fetch_result[ $index ]['sale_price']    = number_format( floatval( $item->OffersV2->Listings[0]->Price->Money->Amount ), 2, '.', '' );
			} else if( isset( $item->OffersV2->Listings[0]->SavingBasis->Money->Amount ) ){
				$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->OffersV2->Listings[0]->SavingBasis->Money->Amount ), 2, '.', '' );
				$fetch_result[ $index ]['sale_price']    = number_format( floatval( $item->OffersV2->Listings[0]->Price->Money->Amount ), 2, '.', '' );
			} elseif ( isset( $item->OffersV2->Listings[0]->Price->Money->Amount ) ) {
				$fetch_result[ $index ]['regular_price'] = number_format( floatval( $item->OffersV2->Listings[0]->Price->Money->Amount ), 2, '.', '' );
			}else {
				$fetch_result[ $index ]['regular_price'] = '';
			}

			$stock_status = ( isset( $item->OffersV2->Listings[0]->Availability->Type ) && $item->OffersV2->Listings[0]->Availability->Type === 'OUT_OF_STOCK' ) ? 'outofstock' : 'instock';
			$fetch_result[ $index ]['stock_status'] = $stock_status;

			$fetch_result[ $index ]['product_url'] = Settings::get_product_url( $country_code, $affiliate_id, $asin );
			$fetch_result[ $index ]['attributes'] = self::process_attribute_pa_api( $item );
		}

		return $fetch_result;
	}

	public static function process_attribute_pa_api( $item ){
		$attributes = array();
		$ByLineInfo = isset($item->ItemInfo->ByLineInfo) ? $item->ItemInfo->ByLineInfo : false;

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

	public static function convert_to_plain_sentence( $input ) {
		// Regular expression to match up to the first appearance of ': ' or '- '
		$pattern = '/^[^:]*: /'; // Check for ': ' first
	
		// Replace the matched part with an empty string
		$output = preg_replace($pattern, '', $input);
	
		// If no match for ': ', then check for '- '
		if ($output === $input) {
			$pattern = '/^[^-]*- /'; // Check for '- ' only if ': ' is not found
			$output = preg_replace($pattern, '', $input);
		}
	
		return ucfirst( $output );
	}
}
/**
 * @codingStandardsIgnoreEnd
 */
