import { Button, Form, message, Switch } from 'antd';
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRemoteAmazonImage, setSettingsToastMessage } from './importSettingsSlice';
import { saveImportSettings } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const ImportSettings = () => {
	const dispatch = useDispatch();
	const { importRemoteAmazonImage, isImportSettingsSaving, isImportSettingsLoading, settingsToastMessage } = useSelector((state) => state.importSettings);

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
        importRemoteAmazonImage
    });

    const onFinish = () => {
        const data = {
            'remote_image': importRemoteAmazonImage ? __( 'Yes', 'affiliate-products-importer-for-woocommerce' ): __( 'No', 'affiliate-products-importer-for-woocommerce' )
        }
        dispatch(saveImportSettings(data));
    };

    const handleRemoteAmazonImage = (value) => {
        dispatch(setRemoteAmazonImage(value));
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
                label={ __( 'Remote amazon images', 'affiliate-products-importer-for-woocommerce' ) }
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