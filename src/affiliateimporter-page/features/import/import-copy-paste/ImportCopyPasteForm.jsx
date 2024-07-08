import React from 'react';
import { Card, Input, Row, Col, Space, Flex, Button, Alert, Tag } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import { setAsinValue, setAsinCodes, setInvalidAsinCodes, setDuplicateAsinCodes, setImportStepIndex, fetchAmazonProducts, setImportFetchItems, setImportableFetchItems, setDisplayImportFetchCounter, setImportFetchErrors, setImportFetchProgress } from './importCopyPasteSlice';
import { CheckCircleOutlined } from '@ant-design/icons';
import ImportFetchCounter from './ImportFetchCounter';
import { setImportStepBack, setImportStepNext } from '../importSlice';

const { TextArea } = Input;

const ImportCopyPasteForm = () => {

	const dispatch = useDispatch();
    const { importType, importStepIndex } = useSelector((state) => state.import);
	const { displayImportFetchCounter, importFetchItems, importFetchAlert, asinCodes, invalidAsinCodes, duplicateAsinCodes, asinValue, asinValueFetched, isImportFetchInProgress, importableFetchItems } = useSelector((state) => state.importCopyPaste);

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
			const regex = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{10}$/;

			if (regex.test(code)) {
				validCodes.push(code);
			} else if (code.length > 0) {
				invalidCodes.push(code);
			}
		});

		let uniqueCodes = validCodes.length ? validCodes.filter((value, index, self) => self.indexOf(value) === index) : [];
		let duplicateCodes = findDuplicates(validCodes);
		console.log(duplicateCodes);
		
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
        dispatch(setImportableFetchItems([]));
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
			await dispatch(fetchAmazonProducts(data));
			
			totalFetchCompleted += asinCodesChunk.length;

			let fetchProgress = Math.round((totalFetchCompleted/totalAsinCodes) * 100)
			dispatch(setImportFetchProgress(fetchProgress));

			i++;
		}

		if(importableFetchItems.length > 0){
			
		}

		dispatch(setImportFetchProgress(100));
		setTimeout(()=>{
            dispatch(setDisplayImportFetchCounter(false));
        }, 2000);
	}

	const renderAsinCodes = () => {
		if (invalidAsinCodes.length > 0) {
			let codeTxt = invalidAsinCodes.length === 1 ? 'code' : 'codes'
			let errorMessage = <><b>{invalidAsinCodes.length} invalid ASIN {codeTxt} detected:</b> {invalidAsinCodes.join(', ')}</>
			return <div style={{ marginTop: '10px' }}>
				<Alert type='error' message={errorMessage}/>
			</div>
		}else if(duplicateAsinCodes.length > 0) {
			let codeTxt = duplicateAsinCodes.length === 1 ? 'code' : 'codes'
			let wasTxt = duplicateAsinCodes.length === 1 ? 'was' : 'were'

			// let warningMessage = <><div>The following ASIN {codeTxt} {wasTxt} detected multiple times in the list:</div><div><b>{duplicateAsinCodes.join(', ')}</b></div></>
			let warningMessage = <>The following ASIN {codeTxt} {wasTxt} detected multiple times, and duplicates have been excluded: <Space>{duplicateAsinCodes.map(code=><Tag color='warning'>{code}</Tag>)}</Space></>
			return <div style={{ marginTop: '10px' }}>
				{warningMessage}
				{/* <Alert type='warning' message={warningMessage}/> */}
			</div>
		}

		return <div style={{ marginTop: '10px' }}>
			Provide ASIN codes separated by commas, newlines, or spaces.
		</div>;
	}

	const renderAmazonTabContent = () => {
		let codeTxt = asinCodes.length === 1 ? 'code' : 'codes';
		let fetchButtonTxt = (asinCodes.length > 0) ? `Verify ${asinCodes.length} ASIN ${codeTxt}` : 'Verify';
		let isFetchButtonDisabled = (asinCodes.length < 1 || invalidAsinCodes.length > 0 || asinValue === asinValueFetched) ? true : false;

		return<>
				<Row gutter={20}>
					<Col span={4}>
						<Flex style={{height:'100%'}} justify='flex-end' align='center'>
							ASIN Codes
						</Flex>
					</Col>
					<Col span={10}>
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
        }else if(!isImportFetchInProgress && importableFetchItems.length){
            let productText = importableFetchItems.length > 1 ? 'products' : 'product'
            alert={
                type:'success',
                message: <>A total of <b>{importableFetchItems.length}</b> importable {productText} were found from this fetch.</>
            }
        }else if(!isImportFetchInProgress && importFetchItems.length && !importableFetchItems.length){
            alert={
                type:'warning',
                message: 'No importable products were found from this fetch.'
            }
        }
        
        if(alert.type){
            return <><Row gutter={20}>
			<Col span={4}></Col>
			<Col span={10}>
			<Alert type={alert.type} message={alert.message}/>
				</Col>
			</Row>
			</>
			
			
        }

        return null;
    }

    if(importStepIndex!==0 && importType === 'copy-paste'){
        let disableNextButton = (!isImportFetchInProgress && importableFetchItems.length) ? false : true;
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
                        {renderAmazonTabContent()}
                        {renderImportFetchAlert()}
                        <Row>
                            <Col span={12}> 
                                <Flex justify='flex-start'>
                                    <Button type="default" onClick={handleImportStepBack}>Back</Button>
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
                {displayImportFetchCounter && <ImportFetchCounter title='ASIN Verification In Progress' />}
            </React.Fragment>
        )
    }else{
        return null;
    }
}

export default ImportCopyPasteForm;