import React from 'react';
import { Row, Col, Space, Flex, Button, Result, Card } from 'antd';
import CategoriesCheckbox from '../../../components/categories/CategoriesCheckbox';
import { ImportOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { setDisplayImportCounter, setSelectedCategories, setIsImportInProgress, setImportQueuedFetchItems, setImportSuccessfulFetchItems, setDisplayImportSuccessMessage, setImportCancelledFetchItems, setImportableFetchItems, setImportFetchItems, setImportFetchProgress, setAsinValue, setInvalidAsinCodes, setDuplicateAsinCodes } from './importCopyPasteSlice';
import ImportFetchCounter from './ImportFetchCounter';
import { setImportStepBack, setImportStepIndex } from '../importSlice';
import { saveProducts } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const ImportCopyPasteFinal = () => {

	const dispatch = useDispatch();
	const { displayImportCounter, importQueue, selectedCategories, isImporting, importFetchItems, importableFetchItems, importCancelledFetchItems, isImportInProgress, importSuccessfulFetchItems, importQueuedFetchItems, displayImportSuccessMessage } = useSelector((state) => state.importCopyPaste);

	let totalImportQueue = importableFetchItems.length - importCancelledFetchItems.length - importSuccessfulFetchItems.length;

	const handleCategoriesChange = (values) => {
		dispatch(setSelectedCategories(values));
	}

    const handleImportStepBack = () => {
        dispatch(setImportStepBack());
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

	const handleImportAgain = () => {
		dispatch(setAsinValue(''));
		dispatch(setInvalidAsinCodes([]));
		dispatch(setDuplicateAsinCodes([]));
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
							{  __( 'Import in', 'affiliate-products-importer' ) }
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
						title={`${__( 'Successfully Imported', 'affiliate-products-importer' )} ${totalSuccessfulImports} ${productText}!`}
						subTitle=""
						extra={[
							<Button type="primary" key="console" onClick={handleImportAgain}>
								{ __( 'Import Again', 'affiliate-products-importer' ) }
							</Button>
						]}
					/>
				</Col>
			</Row>
		}
		return null;
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
                                {!displayImportSuccessMessage && <Button type="default" disabled={isImportInProgress} onClick={handleImportStepBack}>{ __( 'Back', 'affiliate-products-importer' ) }</Button>}
                            </Flex>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                </Space>
            </Card>
			{displayImportCounter && <ImportFetchCounter title={ __( 'Products Import In Progress', 'affiliate-products-importer' ) } />}
		</React.Fragment>
	)
}

export default ImportCopyPasteFinal;