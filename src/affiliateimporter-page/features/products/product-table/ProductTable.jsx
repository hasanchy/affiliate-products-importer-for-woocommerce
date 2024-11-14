import React, { useState } from 'react';
import { Button, Card, Space, Table, Tooltip, Image, Row, Col } from 'antd';
import { ReloadOutlined, EyeOutlined, AmazonOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../services/apiService';
import { setSearchKeyword } from './productTableSlice';
import { __ } from '@wordpress/i18n';
import ProModal from '../../../components/modal/ProModal';

const ProductTable = () => {
    const { isProductsLoading, productList, totalProducts  } = useSelector((state) => state.productTable);
    const dispatch = useDispatch();
	const [selectedProductIds, setSelectedProductIds] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

    const reloadProductList = () => {
		dispatch(setSearchKeyword(''))
		dispatch(fetchProducts({page:1, per_page: 50}))
	}

	const renderImportDate = (importDate) => {
		return <span>{importDate}</span>
	}

    const renderActionButtons = (productId, productObj) => {
		return (
			<>
				<Button type="default"  href={productObj.product_url} target='_blank'><EyeOutlined /></Button>
				{productObj.amazon_product_url && <Button type="default"  href={productObj.amazon_product_url} target='_blank'><AmazonOutlined /></Button>}    
				<Button type="default"  href={`post.php?post=${productId}&action=edit`} target='_blank'><EditOutlined /></Button>
			</>
		)
	}

	const decodeString = ( rawString ) => {
		const parser = new DOMParser();
  		const decodedString = parser.parseFromString(rawString, 'text/html').body.textContent;
		return decodedString;
	}

	const onSelectChange = (selectedProductIds, obj) => {
		setSelectedProductIds(selectedProductIds);
	};

	const handleSyncAllClick = () => {
		setIsModalOpen(true);
	}

	const handleCancel = () => {
        setIsModalOpen(false);
    }

	const renderProModal = () => {
        if(isModalOpen){
            return <ProModal onCancel={handleCancel}/>
        }
        return null;
    }

    const columns = [
		{
			title: __( 'Image', 'affiliate-products-importer-for-woocommerce' ),
			dataIndex: 'image_primary',
			key: 'img',
			render: (imagePrimary, productObj) => <a href={productObj.product_url} target='_blank'>
				<Image
					width={125}
					src={imagePrimary}
					preview={false}
				/>
			</a>,
		},
		{
			title: __( 'Title', 'affiliate-products-importer-for-woocommerce' ),
			dataIndex: 'product_title',
			key: 'title',
			render: (title, productObj) => (
				<a href={productObj.product_url} target='_blank'>{decodeString(title)}</a>
			)
		},
		{
			title: __( 'Price', 'affiliate-products-importer-for-woocommerce' ),
			dataIndex: 'price_html',
			key: 'price',
			render: (price_html, productObj) => (
				<div 
					className="price-html"
					dangerouslySetInnerHTML={{ __html: decodeString(price_html) }}
				/>
			)
		},
		{
			title: __( 'Date Imported', 'affiliate-products-importer-for-woocommerce' ),
			dataIndex: 'product_import_date',
			key: 'import',
			width: 150,
			render: (importDate, productObj) => (
				<>{renderImportDate(importDate, productObj)}</>
			)
		},
		{
			title: __('Last Synced', 'affiliate-products-importer-for-woocommerce'),
			dataIndex: 'sync_date',
			key: 'sync',
			width: 150,
			render: (syncDate) => (
				<></>
			)
		},
		{
			title: __( 'Action', 'affiliate-products-importer-for-woocommerce' ),
			dataIndex:'product_id',
			key: 'action',
			width: 130,
			render: (productId, productObj) => (
				<Space size="middle">
					{renderActionButtons(productId, productObj)}
				</Space>
			)
		}
	];

	const renderSyncAllButton = () => {
		if(selectedProductIds.length){

			let productText = (selectedProductIds.length > 1) ? __('Products', 'affiliate-products-importer-for-woocommerce') : __('Product', 'affiliate-products-importer-for-woocommerce');
			return <Button type="primary" icon={<SyncOutlined/>} onClick={handleSyncAllClick}>
				{__('Sync', 'affiliate-products-importer-for-woocommerce')} {selectedProductIds.length} {__('Selected', 'affiliate-products-importer-for-woocommerce')} {productText} ({__('Pro', 'affiliate-products-importer-for-woocommerce')})
			</Button>
		}else{
			return null;
		}
	}

	return (
		<Card title={`${ __( 'Total Products', 'affiliate-products-importer-for-woocommerce' ) }: ${totalProducts}`} extra={<Tooltip placement="topLeft" title={ __( 'Reload Products List', 'affiliate-products-importer-for-woocommerce' ) } color={'purple'} key={'blue'}><Button type="default" icon={<ReloadOutlined/>} onClick={reloadProductList}></Button></Tooltip>}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
				<Row>
					<Col span={12}>
						{renderProModal()}
						{renderSyncAllButton()}
					</Col>
					<Col span={12}>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Table
							rowSelection={{
								selectedRowKeys: selectedProductIds,
								onChange: onSelectChange
							}}
							loading={isProductsLoading}
							dataSource={productList}
							columns={columns}
							pagination={{
								showSizeChanger: false,
								pageSize: 50,
								total: totalProducts,
								onChange: (page) => {
									dispatch(fetchProducts({page, per_page: 50}));
								}
							}}
							size="middle"
						/>
					</Col>
				</Row>
			</Space>
        </Card>
	)
}

export default ProductTable;