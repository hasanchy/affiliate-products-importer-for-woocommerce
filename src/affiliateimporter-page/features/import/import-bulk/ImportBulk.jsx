import React, { useState } from 'react';
import { Row, Col, Result, Card, Image, Typography, Tooltip, Button, Alert, Switch, Flex, Tag, Space  } from 'antd';
import { DownloadOutlined, UndoOutlined, CloseCircleTwoTone, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { setImportSuccessfulAsins } from './importBulkSlice';
import { setImportStepBack, setImportStepIndex } from '../importSlice';
import { fetchProducts, fetchRecentlyImportedProducts, saveProducts } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';
import ProgressCounter from '../../../components/counter/ProgressCounter';
import AlertView from '../../../components/alert/AlertView';
import { setActiveTab } from '../../../components/menu-tabs/manuTabsSlice';

const { Link } = Typography;

const ImportBulk = ( {selectedCategories, importableItems, deletedAsins, onDeletedAsinsChange, onImportComplete} ) => {

	const dispatch = useDispatch();
	const { importSuccessfulAsins, error } = useSelector((state) => state.importBulk);
    
    const [ displayImportCounter, setDisplayImportCounter ] = useState( false );
    const [ isImportInProgress, setIsImportInProgress ] = useState( false );
    const [ displayImportSuccessMessage, setDisplayImportSuccessMessage ] = useState( false );
    const [ displayImportErrorMessage, setDisplayImportErrorMessage ] = useState( false );
    const [ isImportQueueDeletable, setImportQueueDeletable ] = useState( false );
    const [ importProgress, setImportProgress ] = useState( 0 );

	const IMPORT_PER_REQUEST = 5;

	let totalImportQueue = importableItems.length - deletedAsins.length;

    const handleImportStepBack = () => {
        dispatch(setImportStepBack());
    }

	const importBulkProducts = async () => {
		setImportQueueDeletable(false);
		setDisplayImportSuccessMessage(false);
		setDisplayImportErrorMessage(false);

		let queuedItems = [];

		for(let i in importableItems){
			let asin = importableItems[i].asin;
			if(!deletedAsins.includes(asin)){
				queuedItems.push(importableItems[i]);
			}
		}

		if(queuedItems.length){
			let total = queuedItems.length;
			let size = Math.ceil(total / IMPORT_PER_REQUEST);
			let i = 0;

			let totalCompleted = 0;
			let fetchProgress = 0

			setIsImportInProgress(true)
			setImportProgress(fetchProgress);
        	setDisplayImportCounter(true);

			let importResult;

			while(i<size){
				let start = i*IMPORT_PER_REQUEST;
				let upto = (i + 1) * IMPORT_PER_REQUEST; 
				let importQueueChunk = queuedItems.slice(start, upto);

				const categoryIds = selectedCategories.map(category => category.id);
				let data = {products:importQueueChunk, categories: categoryIds}

				importResult = await dispatch(saveProducts(data));

				totalCompleted += IMPORT_PER_REQUEST;

				fetchProgress = Math.round((totalCompleted/total) * 100)
				setImportProgress(fetchProgress);

				i++;
			}

			setImportProgress(100);

			setIsImportInProgress(false)
			
			if( importResult.type !== 'products/save/rejected' ){
				setDisplayImportSuccessMessage(true);
				dispatch(fetchProducts({page:1, per_page: 50}));
				dispatch(fetchRecentlyImportedProducts({per_page:20}));
			}else{
				setDisplayImportErrorMessage(true);
			}

			setTimeout(()=>{
				setDisplayImportCounter(false);
			}, 1000);
		}
	}

	const handleImportAgain = () => {
		onImportComplete();
		dispatch(setImportSuccessfulAsins([]));
		dispatch(setImportStepIndex(1));
	}

	const handleViewProducts = () => {
		dispatch(setActiveTab( 'products' ));
	}

    let displayUndoButton = deletedAsins.length && isImportQueueDeletable ? 'block' : 'none';

    const handleImportQueueDelete = (asin) => {
		let newDeletedAsins = [...deletedAsins, asin];
		onDeletedAsinsChange(newDeletedAsins);
	}

    const undoImportQueueDelete = () => {
		let newDeletedAsins = [...deletedAsins];
		newDeletedAsins.pop();
		onDeletedAsinsChange(newDeletedAsins);
	}

	const handleSwitchChange = (checked) => {
		setImportQueueDeletable(checked)
	}

	const renderAmazonTabContent = () => {

		if(!displayImportSuccessMessage){
			return<>
				<Row gutter={20}>
					<Col span={24}>
						<Flex justify='center'>
							<Button type="primary" size='large' icon={<DownloadOutlined />} loading={isImportInProgress} disabled={isImportInProgress} onClick={importBulkProducts}>Import {totalImportQueue} Product(s)</Button>
						</Flex>
					</Col>
				</Row>
			</>
		}
		return null;
	}

	const displaySuccessMessage = () => {
		let totalSuccessfulImports = importSuccessfulAsins.length;
		let productText = totalSuccessfulImports > 1 ? 'products' : 'product';
		if(displayImportSuccessMessage && totalSuccessfulImports > 0){
			return <Row gutter={20}>
				<Col span={24}>
					<Result
						status="success"
						title={`${__( 'Successfully Imported', 'affiliate-products-importer-for-woocommerce' )} ${totalSuccessfulImports} ${productText}!`}
						subTitle=""
						extra={[
							<Space>
								<Button type="primary" key="console" onClick={handleImportAgain}>
									{ __( 'Import Again', 'affiliate-products-importer-for-woocommerce' ) }
								</Button>
								<Button type="default" key="console" onClick={handleViewProducts}>
									{__('View Products', 'affiliate-products-importer-pro')}
								</Button>
							</Space>
						]}
					/>
				</Col>
			</Row>
		}
		return null;
	}

	const displayErrorMessage = () => {
		if(displayImportErrorMessage){
			return <AlertView type='error' message={'Import Failed!'} description={error} />;
		}
		return null;
	}

    const renderCardExtra = () => {
		if(!displayImportSuccessMessage && !isImportInProgress){
			return <Flex gap={'small'} align='center'>
				<Tooltip placement="topLeft" title={ __( 'Undo import queue delete', 'affiliate-products-importer-for-woocommerce' ) } color={'purple'} key={'blue'}>
					<Button size='small' type="default" icon={<UndoOutlined/>} style={{display:displayUndoButton}} onClick={undoImportQueueDelete}></Button>
				</Tooltip>
				{importableItems.length > 1 && <Switch checkedChildren={<DeleteOutlined/>} unCheckedChildren={<DeleteOutlined />} onChange={handleSwitchChange}/>}
			</Flex>
		}
		return null;
	}

    const renderProductGallery = () => {

		if(importableItems.length > 0){
			let gallery = [];

			for(let i in importableItems){
				let asin = importableItems[i].asin;
				if(!deletedAsins.includes(asin)){
					
					let isSuccessful = importSuccessfulAsins.includes(asin);

					let imageView;
					if(importableItems[i].image_variants?.length){
						let previewImages = [importableItems[i].image_primary, ...importableItems[i].image_variants]
						imageView =  <Image.PreviewGroup
							items={previewImages}
						>
							<Image src={importableItems[i].image_primary} width='125px'/>
						</Image.PreviewGroup>
					}else{
						imageView = <Image src={importableItems[i].image_primary} alt={importableItems[i].post_title} width='125px'/>;
					}
					
					gallery.push(
						<div className='affprodimp-image-gallery'>
							<Card>
								{!isSuccessful && isImportQueueDeletable && totalImportQueue > 1 && (
									<div style={{position:'absolute', insetInlineEnd:'0', top:'0', cursor:'pointer'}}>
										<CloseCircleTwoTone style={{ fontSize: '20px', color: '#999' }} onClick={handleImportQueueDelete.bind(this, importableItems[i].asin)}/>
									</div>
								)}
								{imageView}
								<div style={{width:'125px'}}>
									<Link href={importableItems[i].product_url} target="_blank">
										{importableItems[i].post_title.substring(0, 55)}...
									</Link>
								</div>
								{isSuccessful && (
									<Alert message={ __( 'Imported!', 'affiliate-products-importer-for-woocommerce' ) } type="success" showIcon />
								)}
                                {isImportInProgress && !isSuccessful && <LoadingOutlined />}
							</Card>
						</div>
					);
				}
			}

			let values = Object.values(selectedCategories);
			let categories = '';
			if (values.length) {
				let categoriesName = values.map(category => <Tag key={`tag${category.id}`} color='lime'>{category.name}</Tag>);
				categories = <div style={{ marginTop: '10px' }}><b>Import in</b>: <Space>{categoriesName}</Space></div>
			}

			return <Card key='import-queue' title={`${ __( 'Import Queue', 'affiliate-products-importer-for-woocommerce' ) }: ${gallery.length}`} bordered={true}  extra={renderCardExtra()}>
				{categories} <br />
				{gallery}
			</Card>;
		}
	}

	return (
		<React.Fragment>
            <Space direction='vertical'
                style={{
                    display: 'flex',
                }}> 
                <Card key='import-bulk'>
                    <Space
                        direction='vertical'
                        size="large"
                        style={{
                            display: 'flex',
                        }}
                    >
                        {displaySuccessMessage()}
						{displayErrorMessage()}
                        {renderAmazonTabContent()}
                        <Row>
                            <Col span={12}> 
                                <Flex justify='flex-start'>
                                    {!displayImportSuccessMessage && <Button type="default" disabled={isImportInProgress} onClick={handleImportStepBack}>{ __( 'Back', 'affiliate-products-importer-for-woocommerce' ) }</Button>}
                                </Flex>
                            </Col>
                            <Col span={12}>
                            </Col>
                        </Row>
                    </Space>
                </Card>
                {renderProductGallery()}
                {displayImportCounter && <ProgressCounter title={ __('Products Import In Progress', 'affiliate-products-importer-for-woocommerce' ) } percent={importProgress} />}
            </Space>
		</React.Fragment>
	)
}

export default ImportBulk;