import React, {useEffect} from 'react';
import { Alert, Button, Form, Input, message, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AU, BE, BR, CA, CN, EG, FR, DE, IN, IT, JP, MX, NL, PL, SA, SG, ES, SE, TR, AE, US, GB } from 'country-flag-icons/react/3x2'
import { setAmazonAccessKey, setAmazonSecretKey, setAmazonCountryCode, setAmazonAffiliateId, setSettingsToastMessage } from './amazonApiSettingsSlice';
import { saveAmazonApiSettings, verifyAmazonApiSettings } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const affiliateCountries = [
    { 'flag': <AU style={{width:'20px'}}/>,'code': 'au', 'name': 'Australia' }, 
    { 'flag': <BE style={{width:'20px'}}/>,'code': 'be', 'name': 'Belgium' }, 
    { 'flag': <BR style={{width:'20px'}}/>,'code': 'br', 'name': 'Brazil' },
    { 'flag': <CA style={{width:'20px'}}/>,'code': 'ca', 'name': 'Canada' },
    { 'flag': <CN style={{width:'20px'}}/>,'code': 'cn', 'name': 'China' }, 
    { 'flag': <EG style={{width:'20px'}}/>,'code': 'eg', 'name': 'Egypt' }, 
    { 'flag': <FR style={{width:'20px'}}/>,'code': 'fr', 'name': 'France' }, 
    { 'flag': <DE style={{width:'20px'}}/>,'code': 'de', 'name': 'Germany' }, 
    { 'flag': <IN style={{width:'20px'}}/>,'code': 'in', 'name': 'India' }, 
    { 'flag': <IT style={{width:'20px'}}/>,'code': 'it', 'name': 'Italy' }, 
    { 'flag': <JP style={{width:'20px'}}/>,'code': 'jp', 'name': 'Japan' }, 
    { 'flag': <MX style={{width:'20px'}}/>,'code': 'mx', 'name': 'Mexico' }, 
    { 'flag': <NL style={{width:'20px'}}/>,'code': 'nl', 'name': 'Netherlands' }, 
    { 'flag': <PL style={{width:'20px'}}/>,'code': 'pl', 'name': 'Poland' }, 
    { 'flag': <SA style={{width:'20px'}}/>,'code': 'sa', 'name': 'Saudi Arabia' }, 
    { 'flag': <SG style={{width:'20px'}}/>,'code': 'sg', 'name': 'Singapore' }, 
    { 'flag': <ES style={{width:'20px'}}/>,'code': 'es', 'name': 'Spain' }, 
    { 'flag': <SE style={{width:'20px'}}/>,'code': 'se', 'name': 'Sweden' }, 
    { 'flag': <TR style={{width:'20px'}}/>,'code': 'tr', 'name': 'Turkey' },
    { 'flag': <AE style={{width:'20px'}}/>,'code': 'ae', 'name': 'United Arab Emirates' }, 
    { 'flag': <US style={{width:'20px'}}/>,'code': 'us', 'name': 'United States' }, 
    { 'flag': <GB style={{width:'20px'}}/>,'code': 'gb', 'name': 'United Kingdom' }
];

const AmazonApiSettings = () => {

	const dispatch = useDispatch();
	const { amazonAccessKey, amazonSecretKey, amazonCountryCode, amazonAffiliateId, isAmazonAPISettingsSaving, isAmazonApiSettingsVerifying, error, settingsToastMessage } = useSelector((state) => state.amazonApiSettings);

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
        amazonAccessKey,
        amazonSecretKey,
        amazonAffiliateId,
        amazonCountryCode
    });

    const handleVerifyAmazonAPISettings = async () => {
        let data = {
			access_key: amazonAccessKey,
			secret_key: amazonSecretKey,
			country_code: amazonCountryCode,
			affiliate_id: amazonAffiliateId
		}

        let response = await dispatch(verifyAmazonApiSettings(data));

        if (response.type.endsWith('/fulfilled')) {
            await dispatch(saveAmazonApiSettings(data));
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
        }
    }

    const renderSaveButton = () => {
        let buttonText;
        if(isAmazonApiSettingsVerifying){
            buttonText = __( 'Verifying...', 'affiliate-products-importer' )
        }else if(isAmazonAPISettingsSaving){
            buttonText = __( 'Saving...', 'affiliate-products-importer' )
        }else{
            buttonText = __( 'Verify & Save', 'affiliate-products-importer' )
        }

        return <Button type="primary" disabled={amazonAccessKey=='' || amazonSecretKey=='' || amazonAffiliateId==''} onClick={handleVerifyAmazonAPISettings} loading={isAmazonApiSettingsVerifying || isAmazonAPISettingsSaving}>
            {buttonText}
        </Button>
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
                    label={ __( 'Amazon AWS Access Key', 'affiliate-products-importer' ) }
                    name="amazonAccessKey"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input Access Key!', 'affiliate-products-importer' ),
                        },
                    ]}
                >
                    <Input value={amazonAccessKey}/>
                </Form.Item>

                <Form.Item
                    label={__( 'Amazon AWS Secret Key', 'affiliate-products-importer' ) }
                    name="amazonSecretKey"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input Secret Key!', 'affiliate-products-importer' ),
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={ __( 'Amazon Affiliate ID', 'affiliate-products-importer' ) }
                    name="amazonAffiliateId"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input your affiliate ID!', 'affiliate-products-importer' ),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="amazonCountryCode"
                    label={ __( 'Amazon Country', 'affiliate-products-importer' ) }
                    rules={[
                        {
                            required: true,
                            message: __( 'Please select Amazon Country!', 'affiliate-products-importer' ),
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
            </Form>
        </>
    )
}

export default AmazonApiSettings;