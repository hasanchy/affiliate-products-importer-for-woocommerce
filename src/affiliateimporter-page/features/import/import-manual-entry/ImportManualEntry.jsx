import React from 'react';
import { Input, Col, Row, Image, Button, Card, Form, InputNumber, Result, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { setProductUrl, setAsinNumber, setProductTitle, setProductDescription, setRegularPrice, setSalePrice, setPrimaryImageUrl, resetState, setProductAddSuccessful, setProductCategories } from './importManualEntrySlice';
import Link from 'antd/es/typography/Link';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchProducts } from '../../../services/apiService';
import CategoriesCheckbox from '../../../components/categories/CategoriesCheckbox';
import { setImportStepBack } from '../importSlice';
import { setActiveTab } from '../../../components/menu-tabs/manuTabsSlice';

const { TextArea } = Input;

const ImportManualEntry = () => {
	const dispatch = useDispatch();
	const { productUrl, asinNumber, productTitle, productDescription, regularPrice, salePrice, primaryImageUrl, productCategories, productAddSuccessful, isProductAdding, lastSavedProduct, error } = useSelector((state) => state.importManualEntry);

    const [form] = Form.useForm();

    form.setFieldsValue({ 
        productUrl,
        productTitle,
        productDescription,
        regularPrice,
        salePrice,
        primaryImageUrl,
        productCategories
    });

    const handleBack = () => {
        dispatch(setImportStepBack());
    }

    const onFieldsChange = () => {

    }

    const onFinish = async () => {
        
        const categories = productCategories.map(category => category.id);

        let data={
            asin: asinNumber,
            post_title: productTitle,
            post_content: productDescription,
            regular_price: regularPrice,
            sale_price: salePrice,
            image_primary: primaryImageUrl,
            categories: categories
        }
        await dispatch(addProduct(data));
            
        dispatch(fetchProducts({page:1, per_page: 50}));
    }

    const onFinishFailed = () => {
    }

    const handleProductUrlChange = (e) => {
        let url = e.target.value
        dispatch(setProductUrl(e.target.value))

        if(url){
            const asinRegex = /(?:\/dp\/|\/gp\/product\/|\/ASIN\/|\/product\/)([A-Z0-9]{10})(?:[/?]|$)/;
            const match = url.match(asinRegex);
            if (match) {
                dispatch(setAsinNumber(match[1]))
            }
        }
    }

    const handleProductTitle = (e) => {
        dispatch(setProductTitle(e.target.value))
    }

    const handleProductDescription = (e) => {
        dispatch(setProductDescription(e.target.value))
    }

    const handleRegularPrice = (value) => {
        dispatch(setRegularPrice(value))
    }

    const handleSalePrice = (value) => {
        dispatch(setSalePrice(value))
    }

    const handlePrimaryImageUrl = (e) => {
        dispatch(setPrimaryImageUrl(e.target.value))
    }

    const renderSaveButton = () => {

        return <Button type="primary" htmlType='submit' loading={isProductAdding}>
            Save
        </Button>

    }

    const handleAddNewProduct = () => {
        dispatch(resetState())
        dispatch(setProductAddSuccessful(null))
    }

    const handleViewProducts = () => {
        dispatch(setActiveTab('products'));
    }

    const handleCategoriesChange = (value) => {
        form.setFieldsValue({ 
            productCategories: value
        });
        dispatch(setProductCategories(value))
    }

    const displayResult = () => {

		if(productAddSuccessful === true){
			return <>
                <Row gutter={20}>
                    <Col span={24}>
                        <Result
                            status="success"
                            title={`Successfully Added a New Product!`}
                            subTitle=""
                            extra={[
                                <Button type="primary" key="console" onClick={handleAddNewProduct}>
                                    Add Another Product
                                </Button>,
                                <Button key="buy" onClick={handleViewProducts}>
                                    View Products
                                </Button>,
                            ]}
                        />
                    </Col>
                </Row>
                {lastSavedProduct &&
                    <Row>
                        <Col span={24} style={{ textAlign: 'center'}}>
                            <div className='affprodimp-image-gallery'>
                                <Card>
                                    <Image src={lastSavedProduct.image_primary} alt={lastSavedProduct.product_title} width='125px'/>
                                    <div style={{width:'125px'}}>
                                        <Link href={lastSavedProduct.product_url} target="_blank">
                                            {lastSavedProduct.product_title.substring(0, 55)}...
                                        </Link>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                }
            </>
		}
		return null;
	}

    const displayForm = () => {
        if(productAddSuccessful !== true){
            return <Form
                name="basic"
                form={form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 800,
                }}
                initialValues={{
                    remember: true,
                }}
                onFieldsChange={onFieldsChange}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Product URL"
                    name="productUrl"
                    rules={[
                        {
                            required: true,
                            message: 'Please input product URL!',
                        },
                        { 
                            type: 'url'
                        },
                        {
                            validator: (_, value) => {
                                
                                if(value){
                                    const asinRegex = /(?:\/dp\/|\/gp\/product\/|\/ASIN\/|\/product\/)([A-Z0-9]{10})(?:[/?]|$)/;

                                    const match = value.match(asinRegex);
                                    if (match) {
                                        return Promise.resolve()
                                    } else {
                                        return Promise.reject(new Error('No valid ASIN was found in the URL.'))
                                    }
                                }else{
                                    return Promise.resolve()
                                }
                            }
                        }
                    ]}
                >
                    <Input value={productUrl} onChange={handleProductUrlChange}/>
                </Form.Item>

                <Form.Item
                    label="Product Title"
                    name="productTitle"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Secret Key!',
                        },
                    ]}
                >
                    <Input value={productTitle} onChange={handleProductTitle}/>
                </Form.Item>

                <Form.Item
                    label="Regular Price"
                    name="regularPrice"
                    rules={[
                        {
                            required: true,
                            message: 'Please input regular price!',
                        },
                    ]}
                >
                    <InputNumber value={regularPrice} onChange={handleRegularPrice} style={{width:'100px'}}/>
                </Form.Item>

                <Form.Item
                    label="Sale Price"
                    name="salePrice"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value || !regularPrice || Number(regularPrice) >= Number(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Sale price can not be higher than the regular price!'));
                            }
                        }
                    ]}
                >
                    <InputNumber value={salePrice} onChange={handleSalePrice} style={{width:'100px'}}/>
                </Form.Item>

                <Form.Item
                    label="Product Description"
                    name="productDescription"
                    rules={[
                        {
                            required: true,
                            message: 'Please input product description!',
                        },
                    ]}
                >
                    <TextArea rows={5} value={productDescription} onChange={handleProductDescription}/>
                </Form.Item>

                <Form.Item
                    label="Primary Image URL"
                    name="primaryImageUrl"
                    rules={[
                        {
                            required: true,
                            message: 'Please input primary image URL!',
                        },
                        { 
                            type: 'url'
                        },
                        {
                            validator: (_, value) => {
                                
                                const imageRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;

                                if(value && !imageRegex.test(value)){
                                    return Promise.reject(new Error('Invalid image URL.'))
                                }else{
                                    return Promise.resolve()
                                }
                            }
                        }
                    ]}
                >
                    <Input value={primaryImageUrl} onChange={handlePrimaryImageUrl}/>
                </Form.Item>

                <Form.Item
                    label="Product categories"
                    name="productCategories"
                    rules={[
                        {
                            required: true,
                            message: 'Please select at least one category',
                        }
                    ]}
                >
                    <CategoriesCheckbox disabled={false} onChange={handleCategoriesChange} displayError={false}/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                {renderSaveButton()}
                </Form.Item>
            </Form>
        }
        return null
    }

    const displayAlert = () => {
        if( error ){
            return <Row style={{
                    maxWidth: 800,
                }}>
                <Col span={8}></Col>
                <Col span={16}>
                    <Alert
                        message={error}
                        type="error"
                        showIcon   
                    />
                </Col>
            </Row>
        }
        return null;
    }

	return <>
        <Card>
            <Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBack}>Back</Button>
            {displayForm()}
            {displayResult()}
            {displayAlert()}
        </Card>
	</>
}

export default ImportManualEntry;