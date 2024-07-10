import React from 'react';
import { Row, Col, Space, Flex, Button, Form, Result, Card, Typography } from 'antd';
import CategoriesCheckbox from '../../../components/categories/CategoriesCheckbox';

import { CloudDownloadOutlined, AndroidOutlined, AppleOutlined, ImportOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux'
import { setDisplayImportCounter, setSelectedCategories, setMessage, setIsImportInProgress, setImportQueuedFetchItems, setImportSuccessfulFetchItems, setDisplayImportSuccessMessage, setImportCancelledFetchItems, setImportableFetchItems, setImportFetchItems, setImportFetchProgress, setAsinValue } from './importCopyPasteSlice';
// import { setActiveTab } from '../../tabs/tabsSlice';
import ImportFetchCounter from './ImportFetchCounter';
import { setImportStepBack, setImportStepIndex } from '../importSlice';
import { saveProducts } from '../../../services/apiService';

const ImportCopyPasteFinal = () => {

	const dispatch = useDispatch();
	const { displayImportCounter, importQueue, selectedCategories, message, isImporting, importFetchItems, importableFetchItems, importCancelledFetchItems, isImportInProgress, importSuccessfulFetchItems, importQueuedFetchItems, displayImportSuccessMessage } = useSelector((state) => state.importCopyPaste);

	let totalImportQueue = importableFetchItems.length - importCancelledFetchItems.length - importSuccessfulFetchItems.length;

	const handleCategoriesChange = (values) => {
		dispatch(setSelectedCategories(values));
	}

    const handleImportStepBack = () => {
        dispatch(setImportStepBack());
    }

    const dispatchSaveProducts = (importQueueChunk, i) => {
        setTimeout(function(){
            dispatch(saveProducts(importQueueChunk));
		}, 2000 * i);
    }

	const importBulkProducts = async () => {
		let queuedFetchItems = [];
		let queuedAsins = [];

		for(let i in importFetchItems){
			let asin = importFetchItems[i].asin;
			if(importableFetchItems.includes(asin) && !importCancelledFetchItems.includes(asin) && !importQueuedFetchItems.includes(asin) && !importSuccessfulFetchItems.includes(asin)){
				queuedFetchItems.push(importFetchItems[i]);
				queuedAsins.push(asin);
			}
		}

		if(queuedFetchItems.length){
			let newQueuedAsins = [...importQueuedFetchItems, ...queuedAsins]
			dispatch(setImportQueuedFetchItems(newQueuedAsins));

			

			let productsPerRequest = 5;
			let total = queuedFetchItems.length;
			let size = Math.ceil(total / productsPerRequest);
			let i = 0;

			let totalCompleted = 0;
			let fetchProgress = 0

			dispatch(setIsImportInProgress(true))
			dispatch(setImportFetchProgress(fetchProgress));
        	dispatch(setDisplayImportCounter(true));

			while(i<size){
				let start = i*productsPerRequest;
				let upto = (i + 1) * productsPerRequest; 
				let importQueueChunk = queuedFetchItems.slice(start, upto);

				const categoryIds = selectedCategories.map(category => category.id);
				let data = {products:importQueueChunk, categories: categoryIds}

				await dispatch(saveProducts(data));

				totalCompleted += productsPerRequest;

				fetchProgress = Math.round((totalCompleted/total) * 100)
				dispatch(setImportFetchProgress(fetchProgress));

				i++;
			}

			dispatch(setImportFetchProgress(100));

			dispatch(setIsImportInProgress(false))
			dispatch(setDisplayImportSuccessMessage(true))

			setTimeout(()=>{
				dispatch(setDisplayImportCounter(false));
			}, 2000);
		}
	}


	const handleViewProducts = () => {
		// dispatch(setActiveTab('products'))
	}

	const handleImportAgain = () => {
		dispatch(setAsinValue(''));
		dispatch(setImportQueuedFetchItems([]));
		dispatch(setImportSuccessfulFetchItems([]));
		dispatch(setImportCancelledFetchItems([]));
		dispatch(setImportableFetchItems([]));
		dispatch(setImportFetchItems([]));
		dispatch(setDisplayImportSuccessMessage(false));
		dispatch(setImportStepIndex(0));
	}

	const renderAmazonTabContent = () => {

		if(!displayImportSuccessMessage){
			let productsLabel = (importQueue.length===1) ? 'Product' : 'Products';

			return<>
				<Row gutter={20}>
					<Col span={4}>
						<Flex style={{height:'100%'}} justify='flex-end' align='center'>
							Import in
						</Flex>
					</Col>
					<Col span={10}>
						<CategoriesCheckbox disabled={isImporting} value={selectedCategories} onChange={handleCategoriesChange} />
					</Col>
				</Row>
				<Row gutter={20}>
					<Col span={4}></Col>
					<Col span={10}>
						<Button type="primary" icon={<ImportOutlined />} loading={isImportInProgress} disabled={!totalImportQueue || selectedCategories.length < 1} onClick={importBulkProducts}>Import {totalImportQueue} {productsLabel}</Button>
					</Col>
				</Row>
			</>
		}
		return null;
	}

	const displaySuccessMessage = () => {
		let totalSuccessfulImports = importSuccessfulFetchItems.length;
		let productText = totalSuccessfulImports > 1 ? 'products' : 'product';
		if(displayImportSuccessMessage && totalSuccessfulImports > 0){
			return <Row gutter={20}>
				<Col span={24}>
					<Result
						status="success"
						title={`Successfully Imported ${totalSuccessfulImports} ${productText}!`}
						subTitle=""
						extra={[
							<Button type="primary" key="console" onClick={handleImportAgain}>
								Import Again
							</Button>,
							<Button key="buy" onClick={handleViewProducts}>
								View Products
							</Button>,
						]}
					/>
				</Col>
			</Row>
		}
		return null;
	}

	const renderMessage = () => {
		if (message) {
			return <div id="setting-error-settings_updated" className="notice notice-success settings-error is-dismissible">
				<p><strong>{message}</strong></p>
				<button type="button" className="notice-dismiss" onClick={() => dispatch(setMessage(''))}>
					<span className="screen-reader-text">Dismiss this notice.</span>
				</button>
			</div>
		} else {
			return null;
		}
	}

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
                    {displaySuccessMessage()}
                    <Row>
                        <Col span={12}> 
                            <Flex justify='flex-start'>
                                {!displayImportSuccessMessage && <Button type="default" onClick={handleImportStepBack}>Back</Button>}
                            </Flex>
                        </Col>
                        <Col span={12}>
                            {/* <Flex justify='flex-end'>
                                <Button type="primary" onClick={handleImportQueue} disabled={disabled}>Fetch</Button>
                            </Flex> */}
                        </Col>
                    </Row>
                </Space>
            </Card>
			{displayImportCounter && <ImportFetchCounter title='Products Import In Progress' />}
		</React.Fragment>
	)
}

export default ImportCopyPasteFinal;