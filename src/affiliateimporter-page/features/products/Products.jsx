import React from 'react';
import { Button, Card, Space, Table, Tooltip, Image } from 'antd';
import { ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../services/apiService';
import { setSearchKeyword } from './productsSlice';
import { __ } from '@wordpress/i18n';

const Products = () => {
    const { isProductsLoading, productList, totalProducts, searchKeyword  } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const reloadProductList = () => {
		dispatch(setSearchKeyword(''))
		dispatch(fetchProducts({page:1, per_page: 10}))
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
			title: __( 'Image', 'affiliate-products-importer' ),
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
			title: __( 'Title', 'affiliate-products-importer' ),
			dataIndex: 'product_title',
			key: 'title',
			render: (title, productObj) => (
				<a href={productObj.product_url} target='_blank'>{decodeString(title)}</a>
			)
		},
		{
			title: __( 'Date Imported', 'affiliate-products-importer' ),
			dataIndex: 'product_import_date',
			key: 'sync',
			width: 150,
			render: (importDate, productObj) => (
				<>{renderImportDate(importDate, productObj)}</>
			)
		},
		{
			title: __( 'Action', 'affiliate-products-importer' ),
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
		<Card title={`${ __( 'Total Products', 'affiliate-products-importer' ) }: ${totalProducts}`} extra={<Tooltip placement="topLeft" title={ __( 'Reload Products List', 'affiliate-products-importer' ) } color={'purple'} key={'blue'}><Button type="default" icon={<ReloadOutlined/>} onClick={reloadProductList}></Button></Tooltip>}>
            <Table
                loading={isProductsLoading}
                dataSource={productList}
                columns={columns}
                pagination={{
                    showSizeChanger: false,
                    pageSize: 10,
                    total: totalProducts,
                    onChange: (page) => {
                        dispatch(fetchProducts({page, keyword: searchKeyword}));
                    }
                }}
                size="middle"
            />
        </Card>
	)
}

export default Products;