import { __ } from '@wordpress/i18n';
import { Card, Steps } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

const ImportSteps = () => {
    const { importStepIndex, importType } = useSelector((state) => state.import);

    const getStepItems = () => {
		let items = [];
		
		if(importType === 'copy-paste' ){
            items = [
                {title: __( 'Import Option', 'affiliate-products-importer-for-woocommerce' ) },
                {title: __( 'ASIN Verification', 'affiliate-products-importer-for-woocommerce' ) },
                {title: __( 'Product Categories', 'affiliate-products-importer-for-woocommerce' ) },
                {title: __( 'Product Import', 'affiliate-products-importer-for-woocommerce' ) }
            ]
		}

		return items;
	}

	return (
        <Card>
            <Steps
                size="default"
                current={importStepIndex}
                items={getStepItems()}
            />
        </Card>
	)
}

export default ImportSteps;