import React from 'react';
import { Card, Input, Row, Col, Space, Flex, Button, Alert, Tag } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import { setAsinValue, setAsinCodes, setInvalidAsinCodes, setDuplicateAsinCodes, setImportFetchItems, setImportableItems, setDisplayImportFetchCounter, setImportFetchErrors, setImportFetchProgress } from './importCopyPasteSlice';
import { CheckCircleOutlined } from '@ant-design/icons';
import { setImportStepBack, setImportStepNext } from '../importSlice';
import { asinVerification } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';
import AmazonApiConnection from '../../../components/amazon-api-connection/AmazonApiConnection';
import ProgressCounter from '../../../components/counter/ProgressCounter';

const { TextArea } = Input;

const ImportCopyPasteForm = () => {

	const dispatch = useDispatch();
	const { displayImportFetchCounter, importFetchItems, importFetchAlert, asinCodes, invalidAsinCodes, duplicateAsinCodes, asinValue, asinValueFetched, isImportFetchInProgress, importableItems, importFetchProgress } = useSelector((state) => state.importCopyPaste);
	const { amazonApiConnectionStatus } = useSelector((state) => state.amazonApiConnection);
	const asinLimit = 100;

	const findDuplicates = (arr) => {
		
		const seen = new Set();
		const duplicates = new Set();

		arr.filter(item => {
			if (seen.has(item)) {
				duplicates.add(item);
			} else {
				seen.add(item);
			}
		});

		return Array.from(duplicates);
	}

	const handleASINCodesChange = (e) => {
		let value = e.target.value;
		dispatch(setAsinValue(value));
		let validCodes = [];
		let invalidCodes = [];
		value.split(/,|\.|\n|\s/).forEach(element => {
			let code = element.trim();
			// Updated regex to match both alphanumeric and numeric 10-character codes
			const regex = /^[A-Z0-9]{10}$/;

			if (regex.test(code)) {
				validCodes.push(code);
			} else if (code.length > 0) {
				invalidCodes.push(code);
			}
		});

		let uniqueCodes = validCodes.length ? validCodes.filter((value, index, self) => self.indexOf(value) === index) : [];
		let duplicateCodes = findDuplicates(validCodes);
		
		dispatch(setAsinCodes(uniqueCodes));
		dispatch(setDuplicateAsinCodes(duplicateCodes));
		dispatch(setInvalidAsinCodes(invalidCodes));
	}

    const handleImportStepBack = () => {
        dispatch(setImportStepBack());
    }

    const handleImportStepNext = () => {
        dispatch(setImportStepNext());
    }

	const handleProductFetch = async () => {

		dispatch(setImportFetchItems([]));
		dispatch(setImportFetchErrors([]));
        dispatch(setImportableItems([]));
        dispatch(setImportFetchProgress(0));
        dispatch(setDisplayImportFetchCounter(true));

		let productsPerRequest = 10;
		let totalAsinCodes = asinCodes.length;
		let size = Math.ceil(totalAsinCodes / productsPerRequest);
		let i = 0;

		let totalFetchCompleted = 0;
		while(i<size){
			let start = i*productsPerRequest;
			let upto = (i + 1) * productsPerRequest; 
			let asinCodesChunk = asinCodes.slice(start, upto);
			
			let data={
				asinCodes: asinCodesChunk
			}
			await dispatch(asinVerification(data));
			
			totalFetchCompleted += asinCodesChunk.length;

			let fetchProgress = Math.round((totalFetchCompleted/totalAsinCodes) * 100)
			dispatch(setImportFetchProgress(fetchProgress));

			i++;
		}

		if(importableItems.length > 0){
			
		}

		dispatch(setImportFetchProgress(100));
		setTimeout(()=>{
            dispatch(setDisplayImportFetchCounter(false));
        }, 2000);
	}

	const renderAsinCodes = () => {
		if (invalidAsinCodes.length > 0) {
			let codeTxt = invalidAsinCodes.length === 1 ? __('code', 'affiliate-products-importer-for-woocommerce') : __('codes', 'affiliate-products-importer-for-woocommerce');
			let errorMessage = <><b>{invalidAsinCodes.length} {__('invalid ASIN', 'affiliate-products-importer-for-woocommerce')} {codeTxt} {__('detected', 'affiliate-products-importer-for-woocommerce')}:</b> {invalidAsinCodes.join(', ')}</>
			return <div style={{ marginTop: '10px' }}>
				<Alert type='error' message={errorMessage}/>
			</div>
		}else if(asinCodes.length > asinLimit) {
			let errorMessage = `${asinCodes.length} ASINs detected. Maximum import limit is ${asinLimit} ASINs per batch.`;
			return <div style={{ marginTop: '10px' }}>
				<Alert type='error' message={errorMessage}/>
			</div>
		}else if(duplicateAsinCodes.length > 0) {
			let codeTxt = duplicateAsinCodes.length === 1 ? __('code', 'affiliate-products-importer-for-woocommerce') : __('codes', 'affiliate-products-importer-for-woocommerce');
			let wasTxt = duplicateAsinCodes.length === 1 ? __('was', 'affiliate-products-importer-for-woocommerce') : __('were', 'affiliate-products-importer-for-woocommerce');

			let warningMessage = <>{__('The following ASIN', 'affiliate-products-importer-for-woocommerce')} {codeTxt} {wasTxt} {__('detected multiple times, and duplicates have been excluded', 'affiliate-products-importer-for-woocommerce')}: <Space>{duplicateAsinCodes.map(code=><Tag color='warning'>{code}</Tag>)}</Space></>
			return <div style={{ marginTop: '10px' }}>
				{warningMessage}
			</div>
		}

		return <div style={{ marginTop: '10px' }}>
			{ __( `Enter ASIN codes separated by commas, newlines, or spaces. Limit: ${asinLimit} ASINs per batch.`, 'affiliate-products-importer-for-woocommerce' ) }
		</div>;
	}

	const renderAmazonTabContent = () => {
		let codeTxt = asinCodes.length === 1 ? __('code', 'affiliate-products-importer-for-woocommerce') : __('codes', 'affiliate-products-importer-for-woocommerce');
		let fetchButtonTxt = (asinCodes.length > 0) ? `${__('Verify', 'affiliate-products-importer-for-woocommerce')} ${asinCodes.length} ASIN ${codeTxt}` : __('Verify', 'affiliate-products-importer-for-woocommerce');
		let isFetchButtonDisabled = (asinCodes.length < 1 || asinCodes.length > asinLimit || invalidAsinCodes.length > 0 || amazonApiConnectionStatus !== 'success') ? true : false;

		return<>
				<Row gutter={20}>
					<Col span={4}>
						<Flex style={{height:'100%'}} justify='flex-end' align='center'>
							{ __( 'ASIN Codes', 'affiliate-products-importer-for-woocommerce' ) }
						</Flex>
					</Col>
					<Col span={20}>
						<TextArea rows={8} defaultValue={asinValue} onChange={handleASINCodesChange}/>
						{renderAsinCodes()}
					</Col>
				</Row>
				<Row gutter={20}>
					<Col span={4}></Col>
					<Col span={10}>
						<Button type="primary" icon={<CheckCircleOutlined />} loading={isImportFetchInProgress} disabled={isFetchButtonDisabled} onClick={handleProductFetch}>
							{fetchButtonTxt}
						</Button>
					</Col>
				</Row>
			</>
	}

	const renderImportFetchAlert = () => {

        let alert = {};
        if(importFetchAlert.message){
            alert=importFetchAlert
        }else if(!isImportFetchInProgress && importableItems.length){
            let productText = importableItems.length > 1 ? 'products' : 'product'
            alert={
                type:'success',
                message: <><b>{importableItems.length}</b> importable {productText} found. Proceed to the next step to select product categories.</>
            }
        }else if(!isImportFetchInProgress && importFetchItems.length && !importableItems.length){
            alert={
                type:'warning',
                message: __('No importable products were found from this list.', 'affiliate-products-importer-for-woocommerce' )
            }
        }
        
        if(alert.type){
            return <>
				<Row gutter={20}>
					<Col span={4}></Col>
					<Col span={20}>
						<Alert type={alert.type} message={alert.message}/>
					</Col>
				</Row>
			</>
        }

        return null;
    }

	const renderAmazonApiConnectionAlert = () => {
		if( amazonApiConnectionStatus !== 'success' ){
			return <Row gutter={20}>
				<Col span={24}>
					<AmazonApiConnection />
				</Col>
			</Row>
		}

		return null;
	}

	let disableNextButton = (!isImportFetchInProgress && importableItems.length) ? false : true;
	return (
		<React.Fragment>
			<Card>
				<Space
					direction='vertical'
					size="large"
					style={{
						display: 'flex',
					}}
				>
					{renderAmazonApiConnectionAlert()}
					{renderAmazonTabContent()}
					{renderImportFetchAlert()}
					<Row>
						<Col span={12}> 
							<Flex justify='flex-start'>
								<Button type="default" disabled={isImportFetchInProgress} onClick={handleImportStepBack}>Back</Button>
							</Flex>
						</Col>
						<Col span={12}>
							<Flex justify='flex-end'>
								<Button type="primary" onClick={handleImportStepNext} disabled={disableNextButton}>Next</Button>
							</Flex>
						</Col>
					</Row>
				</Space>
			</Card>
			{displayImportFetchCounter && <ProgressCounter title={ __('ASIN Verification In Progress', 'affiliate-products-importer-for-woocommerce' ) } percent={importFetchProgress} />}
		</React.Fragment>
	)
}

export default ImportCopyPasteForm;
