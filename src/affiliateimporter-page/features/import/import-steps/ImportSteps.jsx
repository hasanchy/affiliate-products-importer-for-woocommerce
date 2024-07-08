import { Steps } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

const ImportSteps = () => {
    const { importStepIndex, importType } = useSelector((state) => state.import);

    const getStepItems = () => {
		let items = [];
		
		if(importType === 'copy-paste' ){
            items = [
                {title: 'Import Option'},
                {title: 'ASIN Verification'},
                {title: 'Product Import'}
            ]
		}else if(importType === 'search-keyword'){
            items = [
                {title: 'Import Option'},
                {title: 'Product Search'},
                {title: 'Product Import'}
            ]
		}

		return items;
	}

	return (
		<Steps
            size="default"
            current={importStepIndex}
            items={getStepItems()}
        />
	)
}

export default ImportSteps;