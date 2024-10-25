import React from 'react';
import { Button, Card, Space, Table, Tooltip, Image, Row, Col } from 'antd';
import { ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../services/apiService';
import { setSearchKeyword } from './productTableSlice';
import { __ } from '@wordpress/i18n';

const ProductTable = () => {
    const { isProductsLoading, productList, totalProducts  } = useSelector((state) => state.productTable);
    const dispatch = useDispatch();

    const reloadProductList = () => {
		dispatch(setSearchKeyword(''))
		dispatch(fetchProducts({page:1, per_page: 50}))
	}

	const renderImportDate = (importDate) => {
		return <span>{importDate}</span>
	}

    const renderActionButtons = (productId) => {
		return <Button type="default"  href={`post.php?post=${productId}&action=edit`} target='_blank'><EditOutlined /></Button>
	}

	const decodeString = ( rawString ) => {
		const parser = new DOMParser();
  		const decodedString = parser.parseFromString(rawString, 'text/html').body.textContent;
		return decodedString;
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
			title: __( 'Date Imported', 'affiliate-products-importer-for-woocommerce' ),
			dataIndex: 'product_import_date',
			key: 'sync',
			width: 150,
			render: (importDate, productObj) => (
				<>{renderImportDate(importDate, productObj)}</>
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

	return (
		<Card title={`${ __( 'Total Products', 'affiliate-products-importer-for-woocommerce' ) }: ${totalProducts}`} extra={<Tooltip placement="topLeft" title={ __( 'Reload Products List', 'affiliate-products-importer-for-woocommerce' ) } color={'purple'} key={'blue'}><Button type="default" icon={<ReloadOutlined/>} onClick={reloadProductList}></Button></Tooltip>}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
				<Row>
					<Col span={24}>
						<Table
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