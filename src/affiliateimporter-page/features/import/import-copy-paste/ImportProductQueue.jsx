import React, {memo} from 'react';
import { Card, Image, Typography, Tooltip, Button, Alert, Switch, Flex  } from 'antd';
import {  UndoOutlined, CloseCircleTwoTone, DeleteOutlined } from '@ant-design/icons';
import { setImportCancelledFetchItems, setImportQueuedFetchItems, setImportQueueDeletable, setIsImportInProgress } from './importCopyPasteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchRecentlyImportedProducts, saveProducts } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const { Link } = Typography;

const ImportProductQueue = memo(() => {
	let dispatch = useDispatch();

	const { selectedCategories, importFetchItems, importableFetchItems, importCancelledFetchItems, importQueuedFetchItems, importSuccessfulFetchItems, isImportQueueDeletable, displayImportSuccessMessage, isImportInProgress } = useSelector((state) => state.importCopyPaste);

	let displayUndoButton = importCancelledFetchItems.length && isImportQueueDeletable ? 'block' : 'none';
	const handleImportQueueDelete = (asin) => {
		let cancelledItems = [...importCancelledFetchItems, asin];
		dispatch(setImportCancelledFetchItems(cancelledItems));
	}

	const undoImportQueueDelete = () => {
		let cancelledItems = [...importCancelledFetchItems];
		cancelledItems.pop();
		dispatch(setImportCancelledFetchItems(cancelledItems));
	}

	const handleSingleProductImport = async (importFetchItem) => {
		let newQueuedAsins = [...importQueuedFetchItems, importFetchItem.asin]

		const categoryIds = selectedCategories.map(category => category.id);
		let data = {products:[importFetchItem], categories: categoryIds}

		dispatch(setIsImportInProgress(true))
		dispatch(setImportQueuedFetchItems(newQueuedAsins));
		await dispatch(saveProducts(data));
		dispatch(setIsImportInProgress(false));
		dispatch(fetchProducts({page:1, per_page: 10}));
		dispatch(fetchRecentlyImportedProducts({per_page:20}));
	}

	const handleSwitchChange = (checked) => {
		dispatch(setImportQueueDeletable(checked))
	}

	const renderCardExtra = () => {
		if(!displayImportSuccessMessage && !isImportInProgress){
			return <Flex gap={'small'} align='center'>
				<Tooltip placement="topLeft" title={ __( 'Undo import queue delete', 'affiliate-products-importer' ) } color={'purple'} key={'blue'}>
					<Button size='small' type="default" icon={<UndoOutlined/>} style={{display:displayUndoButton}} onClick={undoImportQueueDelete}></Button>
				</Tooltip>
				<Switch checkedChildren={<DeleteOutlined/>} unCheckedChildren={<DeleteOutlined />}  onChange={handleSwitchChange}/>
			</Flex>
		}
		return null;
	}

	const renderProductGallery = () => {
		let gallery = [];

		for(let i in importFetchItems){
			let asin = importFetchItems[i].asin;
			if(importableFetchItems.includes(asin) && !importCancelledFetchItems.includes(asin)){
				
				let isSuccessful = importSuccessfulFetchItems.includes(asin);
				let isLoading = importQueuedFetchItems.includes(asin);
				
				gallery.push(
					<div className='affprodimp-image-gallery'>
						<Card>
							{!isLoading && !isSuccessful && isImportQueueDeletable && (
								<div style={{position:'absolute', insetInlineEnd:'0', top:'0', cursor:'pointer'}}>
									<CloseCircleTwoTone style={{ fontSize: '20px', color: '#999' }} onClick={handleImportQueueDelete.bind(this, importFetchItems[i].asin)}/>
								</div>
							)}
							<Image src={importFetchItems[i].image_primary} alt={importFetchItems[i].post_title} width='125px'/>
							<div style={{width:'125px'}}>
								<Link href={importFetchItems[i].product_url} target="_blank">
									{importFetchItems[i].post_title.substring(0, 55)}...
								</Link>
							</div>
							{isSuccessful && (
								<Alert message={ __( 'Imported!', 'affiliate-products-importer' ) } type="success" showIcon />
							)}
							{!isSuccessful && (
								<Button type='default' disabled={!selectedCategories.length} loading={isLoading} onClick={handleSingleProductImport.bind(this, importFetchItems[i])}>{ __( 'Import', 'affiliate-products-importer' ) }</Button>
							)}
						</Card>
					</div>
				);
			}
		}

		return gallery;
	}
	
	let totalImportQueue = importableFetchItems.length - importCancelledFetchItems.length;
    return (
		<>
			{importableFetchItems.length > 0 &&
				<Card title={`${ __( 'Import Queue', 'affiliate-products-importer' ) }: ${totalImportQueue}`} bordered={true}  extra={renderCardExtra()}>
					{renderProductGallery()}
				</Card>
			}
		</>
	)
})

export default ImportProductQueue;