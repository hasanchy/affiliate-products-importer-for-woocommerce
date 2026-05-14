import React, {useEffect} from 'react';
import { Alert, Button, Form, Input, message, Radio, Select, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AU, BE, BR, CA, CN, EG, FR, DE, IN, IT, JP, MX, NL, PL, SA, SG, ES, SE, TR, AE, US, GB } from 'country-flag-icons/react/3x2'
import { setAmazonAccessKey, setAmazonSecretKey, setAmazonCountryCode, setAmazonAffiliateId, setSettingsToastMessage, setAmazonApiType, setAmazonClientId, setAmazonClientSecret, setAmazonApiVersion } from './amazonApiSettingsSlice';
import { saveAmazonApiSettings, verifyAmazonApiSettings } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';
import { setAmazonApiConnectionStatus } from '../../../components/amazon-api-connection/amazonApiConnectionSlice';

const affiliateCountries = [
    { 'flag': <AU style={{width:'20px'}}/>,'code': 'au', 'name': 'Australia', 'apiVersions': ['2.3', '3.3'] }, 
    { 'flag': <BE style={{width:'20px'}}/>,'code': 'be', 'name': 'Belgium', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <BR style={{width:'20px'}}/>,'code': 'br', 'name': 'Brazil', 'apiVersions': ['2.1', '3.1'] },
    { 'flag': <CA style={{width:'20px'}}/>,'code': 'ca', 'name': 'Canada', 'apiVersions': ['2.1', '3.1'] },
    { 'flag': <EG style={{width:'20px'}}/>,'code': 'eg', 'name': 'Egypt', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <FR style={{width:'20px'}}/>,'code': 'fr', 'name': 'France', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <DE style={{width:'20px'}}/>,'code': 'de', 'name': 'Germany', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <IN style={{width:'20px'}}/>,'code': 'in', 'name': 'India', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <IT style={{width:'20px'}}/>,'code': 'it', 'name': 'Italy', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <JP style={{width:'20px'}}/>,'code': 'jp', 'name': 'Japan', 'apiVersions': ['2.3', '3.3'] }, 
    { 'flag': <MX style={{width:'20px'}}/>,'code': 'mx', 'name': 'Mexico', 'apiVersions': ['2.1', '3.1'] }, 
    { 'flag': <NL style={{width:'20px'}}/>,'code': 'nl', 'name': 'Netherlands', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <PL style={{width:'20px'}}/>,'code': 'pl', 'name': 'Poland', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <SA style={{width:'20px'}}/>,'code': 'sa', 'name': 'Saudi Arabia', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <SG style={{width:'20px'}}/>,'code': 'sg', 'name': 'Singapore', 'apiVersions': ['2.3', '3.3'] }, 
    { 'flag': <ES style={{width:'20px'}}/>,'code': 'es', 'name': 'Spain', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <SE style={{width:'20px'}}/>,'code': 'se', 'name': 'Sweden', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <TR style={{width:'20px'}}/>,'code': 'tr', 'name': 'Turkey', 'apiVersions': ['2.2', '3.2'] },
    { 'flag': <AE style={{width:'20px'}}/>,'code': 'ae', 'name': 'United Arab Emirates', 'apiVersions': ['2.2', '3.2'] }, 
    { 'flag': <GB style={{width:'20px'}}/>,'code': 'uk', 'name': 'United Kingdom', 'apiVersions': ['2.2', '3.2'] },
    { 'flag': <US style={{width:'20px'}}/>,'code': 'us', 'name': 'United States', 'apiVersions': ['2.1', '3.1'] }, 
];

const AmazonApiSettings = () => {

	const dispatch = useDispatch();
	const { amazonApiType, amazonClientId, amazonClientSecret, amazonApiVersion, amazonAccessKey, amazonSecretKey, amazonCountryCode, amazonAffiliateId, isAmazonAPISettingsSaving, isAmazonApiSettingsVerifying, error, settingsToastMessage } = useSelector((state) => state.amazonApiSettings);

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
        amazonApiType,
        amazonClientId,
        amazonClientSecret,
        amazonApiVersion,
        amazonAccessKey,
        amazonSecretKey,
        amazonAffiliateId,
        amazonCountryCode
    });

    const handleVerifyAmazonAPISettings = async () => {

        let data;

        if(amazonApiType === 'pa_api'){
            data = {
                api_type: amazonApiType,
                access_key: amazonAccessKey,
                secret_key: amazonSecretKey,
                country_code: amazonCountryCode,
                affiliate_id: amazonAffiliateId
            }
        }else{
            data = {
                api_type: amazonApiType,
                client_id: amazonClientId,
                client_secret: amazonClientSecret,
                api_version: amazonApiVersion,
                country_code: amazonCountryCode,
                affiliate_id: amazonAffiliateId
            }
        }
        

        let response = await dispatch(verifyAmazonApiSettings(data));

        if (response.type.endsWith('/fulfilled')) {
            await dispatch(saveAmazonApiSettings(data));
            dispatch( setAmazonApiConnectionStatus( 'success' ) );
        }
    }

    const onFieldsChange = (values) => {
        let fieldName = values[0].name[0];
        let fieldValue = values[0].value;

        if(fieldName == 'amazonAccessKey'){
            dispatch(setAmazonAccessKey(fieldValue));
        }else if(fieldName == 'amazonSecretKey'){
            dispatch(setAmazonSecretKey(fieldValue));
        }else if(fieldName == 'amazonAffiliateId'){
            dispatch(setAmazonAffiliateId(fieldValue));
        }else if(fieldName == 'amazonCountryCode'){
            dispatch(setAmazonCountryCode(fieldValue));
            dispatch(setAmazonApiVersion(null));
        }else if(fieldName == 'amazonApiType'){
            dispatch(setAmazonApiType(fieldValue));
        }else if(fieldName == 'amazonClientId'){
            dispatch(setAmazonClientId(fieldValue));
        }else if(fieldName == 'amazonClientSecret'){
            dispatch(setAmazonClientSecret(fieldValue));
        }else if(fieldName == 'amazonApiVersion'){
            dispatch(setAmazonApiVersion(fieldValue));
        }
    }

    const renderSaveButton = () => {
        let buttonText;
        if(isAmazonApiSettingsVerifying){
            buttonText = __( 'Verifying...', 'affiliate-products-importer-for-woocommerce' )
        }else if(isAmazonAPISettingsSaving){
            buttonText = __( 'Saving...', 'affiliate-products-importer-for-woocommerce' )
        }else{
            buttonText = __( 'Verify & Save', 'affiliate-products-importer-for-woocommerce' )
        }

        return <Button type="primary" disabled={ (amazonApiType=='creators_api' && ( amazonClientId=='' || amazonClientSecret=='' || amazonApiVersion==null ) ) || (amazonApiType=='pa_api' && ( amazonAccessKey=='' || amazonSecretKey=='' ) ) || amazonAffiliateId==''} onClick={handleVerifyAmazonAPISettings} loading={isAmazonApiSettingsVerifying || isAmazonAPISettingsSaving}>
            {buttonText}
        </Button>
    }

    const options = [
        {
            label: <>{__( 'Creators API', 'affiliate-products-importer-for-woocommerce' )}</>,
            value: 'creators_api',
        },
        {
            label: <>{__( 'Product Advertising API', 'affiliate-products-importer-for-woocommerce' )}</>,
            value: 'pa_api',
        }
    ];

    const renderAmazonApiCredentialInputFields = () => {
        
        if(amazonApiType == 'pa_api'){
            return (
                <>
                    <Form.Item
                    label={ __( 'PA API Access Key', 'affiliate-products-importer-for-woocommerce' ) }
                    name="amazonAccessKey"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input Access Key!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                    ]}
                >
                    <Input value={amazonAccessKey}/>
                </Form.Item>

                <Form.Item
                    label={__( 'PA API Secret Key', 'affiliate-products-importer-for-woocommerce' ) }
                    name="amazonSecretKey"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input Secret Key!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                </>
            );
        }else if(amazonApiType == 'creators_api'){
            return (
                <>
                    <Form.Item
                        label={__('Creators API Client ID', 'affiliate-products-importer-for-woocommerce')}
                        name="amazonClientId"
                        rules={[
                            {
                                required: true,
                                message: __('Please input Amazon Creators API Client ID!', 'affiliate-products-importer-for-woocommerce'),
                            }
                        ]}
                    >
                        <Input value={amazonClientId} />
                    </Form.Item>
                    <Form.Item
                        label={__('Creators API Client Secret', 'affiliate-products-importer-for-woocommerce')}
                        name="amazonClientSecret"
                        rules={[
                            {
                                required: true,
                                message: __('Please input Amazon Creators API Client Secret!', 'affiliate-products-importer-for-woocommerce'),
                            }
                        ]}
                    >
                        <Input.Password visibilityToggle={true} />
                    </Form.Item>

                    <Form.Item
                        name="amazonApiVersion"
                        label={__('Creators API Version', 'affiliate-products-importer-for-woocommerce')}
                        rules={[
                            {
                                required: true,
                                message: __('Please select Creators API Version!', 'affiliate-products-importer-for-woocommerce'),
                            }
                        ]}
                    >
                        <Select placeholder={__('Select Creators API Version', 'affiliate-products-importer-for-woocommerce')}>
                            {affiliateCountries.find(country => country.code === amazonCountryCode)?.apiVersions.map(apiVersion => {
                                return <Select.Option key={apiVersion} value={apiVersion}>
                                    {apiVersion}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </>
            );
        }
    }

	return (
        <>
            {error &&
                <Alert message={error} type="error" showIcon />
            }
            <br/>
            <Form
                name="basic"
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
                onFieldsChange={onFieldsChange}
                autoComplete="off"
            >
                <Form.Item
                    name="amazonApiType"
                    label={ __( 'Amazon API Type', 'affiliate-products-importer-for-woocommerce' ) }
                >
                    <Radio.Group
                        options={options}
                        defaultValue={amazonApiType}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
                
                {renderAmazonApiCredentialInputFields()}

                <Form.Item
                    label={ __( 'Amazon Tracking ID', 'affiliate-products-importer-for-woocommerce' ) }
                    name="amazonAffiliateId"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input your tracking ID!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="amazonCountryCode"
                    label={ __( 'Amazon Country', 'affiliate-products-importer-for-woocommerce' ) }
                    rules={[
                        {
                            required: true,
                            message: __( 'Please select Amazon Country!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                    ]}
                >
                    <Select
                    >
                        {affiliateCountries.map(countryObj => {
                            return  <Select.Option key={countryObj.code} value={countryObj.code}> 
                                {countryObj.flag} {countryObj.name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                {renderSaveButton()}
                </Form.Item>
                <Form.Item
                            wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    {amazonApiType === 'creators_api' && amazonApiVersion == null && <Typography.Text type='danger'>{__('Please select Creators API Version!', 'affiliate-products-importer-for-woocommerce')}</Typography.Text>}
                </Form.Item>
            </Form>
        </>
    )
}

export default AmazonApiSettings;