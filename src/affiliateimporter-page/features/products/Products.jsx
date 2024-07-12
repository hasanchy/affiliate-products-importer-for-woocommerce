import React, {useEffect} from 'react';
import { Button, Card, Col, Input, Row, Space, Table, Tag, Tooltip, Image } from 'antd';
import { SyncOutlined, ReloadOutlined, RedoOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../services/apiService';
import { setSearchKeyword } from './productsSlice';

const Products = () => {
    const { isProductsLoading, productList, totalProducts, searchKeyword  } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    // useEffect(()=>{
    //     dispatch(fetchProducts());
    // },[])

    const reloadProductList = () => {
		dispatch(setSearchKeyword(''))
		dispatch(fetchProducts({page:1, per_page: 10}))
	}

	const renderImportDate = (importDate, productObj) => {
		return <span>{importDate}</span>
	}

    const renderActionButtons = (productId, productObj) => {
		return <Button type="default"  href={`post.php?post=${productId}&action=edit`} target='_blank'><EditOutlined /></Button>
	}

    const columns = [
		{
			title: 'Image',
			dataIndex: 'image_primary',
			key: 'img',
			render: (imagePrimary) => <Image
				width={125}
				src={imagePrimary}
			/>,
		},
		{
			title: 'Title',
			dataIndex: 'product_title',
			key: 'title',
			render: (title, productObj) => (
				<a href={productObj.product_url} target='_blank'>{title}</a>
			)
		},
		{
			title: 'Date Imported',
			dataIndex: 'product_import_date',
			key: 'sync',
			width: 150,
			render: (importDate, productObj) => (
				<>{renderImportDate(importDate, productObj)}</>
			)
		},
		{
			title: 'Action',
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
		<Card title={`Total Products: ${totalProducts}`} extra={<Tooltip placement="topLeft" title="Reload Products List" color={'purple'} key={'blue'}><Button type="default" icon={<ReloadOutlined/>} onClick={reloadProductList}></Button></Tooltip>}>
            <Row>
                <Col span={12}></Col>
                <Col span={12}>
                    <Space direction="horizontal" style={{width: '100%', justifyContent: 'right'}}>
                        {/* <Input.Search placeholder="input search text" value={searchKeyword} onChange={handleSearchKeywordChange} onSearch={onSearch}/>
                        <Button type="default" icon={<PlusOutlined/>} onClick={handleAddNewProductClick}>Add New Product</Button> */}
                    </Space>
                </Col>
            </Row>
            <br/>
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