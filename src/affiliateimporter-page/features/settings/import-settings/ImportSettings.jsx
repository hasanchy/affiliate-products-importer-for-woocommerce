import { Button, Checkbox, Form, message, Space, Switch, Select } from 'antd';
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRemoteAmazonImage, setImportProductType, setSettingsGalleryImages, setSettingsProductAttributes, setSettingsProductPrice, setSettingsToastMessage } from './importSettingsSlice';
import { saveImportSettings } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const ImportSettings = () => {
	const dispatch = useDispatch();
	const { importRemoteAmazonImage, importProductType, importGalleryImages, importProductPrice, importProductDescription, importProductAttributes, isImportSettingsSaving, isImportSettingsLoading, settingsToastMessage } = useSelector((state) => state.importSettings);

	const [form] = Form.useForm();

    useEffect(() => {
		if(settingsToastMessage){
			message.success({
				style: {marginTop: '32px'},
				content: settingsToastMessage,
                duration: 3.5
			})
			dispatch(setSettingsToastMessage(''));
		}
	}, [settingsToastMessage])

    form.setFieldsValue({ 
        importRemoteAmazonImage,
        importProductType
    });

    const onFinish = () => {
        const data = {
            'remote_image': importRemoteAmazonImage ? 'yes' : 'no',
            'product_type': importProductType,
            'gallery_images': importGalleryImages ? 'yes' : 'no',
            'product_price': importProductPrice ? 'yes' : 'no',
            'product_description': importProductDescription ? 'yes' : 'no',
            'product_attributes': importProductAttributes ? 'yes' : 'no',
        }
        dispatch(saveImportSettings(data));
    };

    const handleRemoteAmazonImage = (value) => {
        dispatch(setRemoteAmazonImage(value));
    }

    const handleImportProductType = (value) => {
        dispatch(setImportProductType(value));
    }

    const handleGalleryImages = (e) => {
        let value = e.target.checked;
        dispatch(setSettingsGalleryImages(value));
    }

    const handleProductPrice = (e) =>{
        let value = e.target.checked;
        dispatch(setSettingsProductPrice(value));
    }
    
    const handleProductAttributes = (e) =>{
        let value = e.target.checked;
        dispatch(setSettingsProductAttributes(value));
    }

	return (
		<Form
            name="importSettings"
            form={form}
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
            disabled={isImportSettingsLoading}
        >
            <Form.Item
                label={ __( 'Remote Amazon images', 'affiliate-products-importer-for-woocommerce' ) }
                name="importRemoteAmazonImage"
            >
                <Switch
                    checkedChildren={'Yes'}
                    unCheckedChildren={'No'}
                    defaultChecked={importRemoteAmazonImage}
                    onChange={handleRemoteAmazonImage}
                />
            </Form.Item>

            <Form.Item
                name="importProductType"
                label={ __( 'Product Type', 'affiliate-products-importer-for-woocommerce' ) }
            >
                <Select
                    onChange={handleImportProductType}
                >
                    <Select.Option key='external' value='external'> 
                        {__( 'External/Affiliate Product', 'affiliate-products-importer-for-woocommerce' ) }
                    </Select.Option>
                    <Select.Option key='simple' value='simple'> 
                        {__( 'Simple Product', 'affiliate-products-importer-for-woocommerce' ) }
                    </Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Import data"
                name="importData"
            >
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        display: 'flex',
                    }}
                >
                    <Checkbox name="productName" checked disabled>Product Name</Checkbox>
                    <Checkbox name="productThumbnail" checked disabled>Product Thumbnail</Checkbox>
                    <Checkbox name="productDescription" checked disabled>Product Description</Checkbox>
                    <Checkbox name="productPrice" checked={importProductPrice} onChange={handleProductPrice}>Product Price</Checkbox>
                    <Checkbox name="productGalleryImages" checked={importGalleryImages} onChange={handleGalleryImages}>Product Gallery Images</Checkbox>
                    <Checkbox name="productAttributes" checked={importProductAttributes} onChange={handleProductAttributes}>Product Attributes</Checkbox>
                </Space>        
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" loading={isImportSettingsSaving}>
                    { __( 'Submit', 'affiliate-products-importer-for-woocommerce' ) }
                </Button>
            </Form.Item>
        </Form>
	);
}

export default ImportSettings;