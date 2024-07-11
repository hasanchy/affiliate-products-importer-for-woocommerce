import React, {memo} from 'react';
import { Card, Image, Typography, Tooltip, Button, Alert, Switch, Flex  } from 'antd';
import {  UndoOutlined, CloseCircleTwoTone, DeleteOutlined } from '@ant-design/icons';
import { setImportCancelledFetchItems, setImportQueuedFetchItems, setImportQueueDeletable } from './importCopyPasteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { saveProducts } from '../../../services/apiService';

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

	const handleSingleProductImport = (importFetchItem) => {
		let newQueuedAsins = [...importQueuedFetchItems, importFetchItem.asin]

		const categoryIds = selectedCategories.map(category => category.id);
		let data = {products:[importFetchItem], categories: categoryIds}

		dispatch(setImportQueuedFetchItems(newQueuedAsins));
		dispatch(saveProducts(data));
	}

	const handleSwitchChange = (checked) => {
		dispatch(setImportQueueDeletable(checked))
	}

	const renderCardExtra = () => {
		if(!displayImportSuccessMessage && !isImportInProgress){
			return <Flex gap={'small'} align='center'>
				<Tooltip placement="topLeft" title="Undo import queue delete" color={'purple'} key={'blue'}>
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
				let previewImages = [importFetchItems[i].image_primary, ...importFetchItems[i].image_variants]
				
				gallery.push(
					<div className='azoncom-image-gallery'>
							<Card>
								<Image.PreviewGroup
									items={previewImages}
									>
										{!isLoading && !isSuccessful && isImportQueueDeletable && (
											<div style={{position:'absolute', insetInlineEnd:'0', top:'0', cursor:'pointer'}}>
												<CloseCircleTwoTone style={{ fontSize: '20px', color: '#999' }} onClick={handleImportQueueDelete.bind(this, importFetchItems[i].asin)}/>
											</div>
										)}
									<Image src={importFetchItems[i].image_primary} alt={importFetchItems[i].post_title} width='125px'/>
								</Image.PreviewGroup>
								<div style={{width:'125px'}}>
									<Link href={importFetchItems[i].product_url} target="_blank">
										{importFetchItems[i].post_title.substring(0, 55)}...
									</Link>
								</div>
								{isSuccessful && (
									<Alert message="Imported!" type="success" showIcon />
								)}
								{!isSuccessful && (
									<Button type='default' disabled={!selectedCategories.length} loading={isLoading} onClick={handleSingleProductImport.bind(this, importFetchItems[i])}>Import</Button>
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
				<Card title={`Import Queue: ${totalImportQueue}`} bordered={true}  extra={renderCardExtra()}>
					{renderProductGallery()}
				</Card>
			}
		</>
	)
})

export default ImportProductQueue;