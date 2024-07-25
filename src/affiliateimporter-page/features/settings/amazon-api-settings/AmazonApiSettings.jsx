import React, {useEffect} from 'react';
import { Alert, Button, Form, Input, message, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AU, BE, BR, CA, CN, EG, FR, DE, IN, IT, JP, MX, NL, PL, SA, SG, ES, SE, TR, AE, US, GB } from 'country-flag-icons/react/3x2'
import { setAmazonAccessKey, setAmazonSecretKey, setAmazonCountryCode, setAmazonAffiliateId, setSettingsToastMessage } from './amazonApiSettingsSlice';
import { saveAmazonApiSettings, verifyAmazonApiSettings } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const affiliateCountries = [
    { 'countryFlag': <AU style={{width:'20px'}}/>,'countryCode': <AU />, 'countryName': 'Australia', 'countryMarketplace': 'www.amazon.com.au' }, 
    { 'countryFlag': <BE style={{width:'20px'}}/>,'countryCode': 'be', 'countryName': 'Belgium', 'countryMarketplace': 'www.amazon.com.be' }, 
    { 'countryFlag': <BR style={{width:'20px'}}/>,'countryCode': 'br', 'countryName': 'Brazil', 'countryMarketplace': 'www.amazon.com.br' },
    { 'countryFlag': <CA style={{width:'20px'}}/>,'countryCode': 'ca', 'countryName': 'Canada', 'countryMarketplace': 'www.amazon.ca' },
    { 'countryFlag': <CN style={{width:'20px'}}/>,'countryCode': 'cn', 'countryName': 'China', 'countryMarketplace': 'www.amazon.cn' }, 
    { 'countryFlag': <EG style={{width:'20px'}}/>,'countryCode': 'eg', 'countryName': 'Egypt', 'countryMarketplace': 'www.amazon.eg' }, 
    { 'countryFlag': <FR style={{width:'20px'}}/>,'countryCode': 'fr', 'countryName': 'France', 'countryMarketplace': 'www.amazon.fr' }, 
    { 'countryFlag': <DE style={{width:'20px'}}/>,'countryCode': 'de', 'countryName': 'Germany', 'countryMarketplace': 'www.amazon.de' }, 
    { 'countryFlag': <IN style={{width:'20px'}}/>,'countryCode': 'in', 'countryName': 'India', 'countryMarketplace': 'www.amazon.in' }, 
    { 'countryFlag': <IT style={{width:'20px'}}/>,'countryCode': 'it', 'countryName': 'Italy', 'countryMarketplace': 'www.amazon.it' }, 
    { 'countryFlag': <JP style={{width:'20px'}}/>,'countryCode': 'jp', 'countryName': 'Japan', 'countryMarketplace': 'www.amazon.co.jp' }, 
    { 'countryFlag': <MX style={{width:'20px'}}/>,'countryCode': 'mx', 'countryName': 'Mexico', 'countryMarketplace': 'www.amazon.com.mx' }, 
    { 'countryFlag': <NL style={{width:'20px'}}/>,'countryCode': 'nl', 'countryName': 'Netherlands', 'countryMarketplace': 'www.amazon.nl' }, 
    { 'countryFlag': <PL style={{width:'20px'}}/>,'countryCode': 'pl', 'countryName': 'Poland', 'countryMarketplace': 'www.amazon.pl' }, 
    { 'countryFlag': <SA style={{width:'20px'}}/>,'countryCode': 'sa', 'countryName': 'Saudi Arabia', 'countryMarketplace': 'www.amazon.sa' }, 
    { 'countryFlag': <SG style={{width:'20px'}}/>,'countryCode': 'sg', 'countryName': 'Singapore', 'countryMarketplace': 'www.amazon.sg' }, 
    { 'countryFlag': <ES style={{width:'20px'}}/>,'countryCode': 'es', 'countryName': 'Spain', 'countryMarketplace': 'www.amazon.es' }, 
    { 'countryFlag': <SE style={{width:'20px'}}/>,'countryCode': 'se', 'countryName': 'Sweden', 'countryMarketplace': 'www.amazon.se' }, 
    { 'countryFlag': <TR style={{width:'20px'}}/>,'countryCode': 'tr', 'countryName': 'Turkey', 'countryMarketplace': 'www.amazon.com.tr' },
    { 'countryFlag': <AE style={{width:'20px'}}/>,'countryCode': 'ae', 'countryName': 'United Arab Emirates', 'countryMarketplace': 'www.amazon.ae' }, 
    { 'countryFlag': <US style={{width:'20px'}}/>,'countryCode': 'us', 'countryName': 'United States', 'countryMarketplace': 'www.amazon.com' }, 
    { 'countryFlag': <GB style={{width:'20px'}}/>,'countryCode': 'gb', 'countryName': 'United Kingdom', 'countryMarketplace': 'www.amazon.co.uk' }
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
                        defaultValue="us"
                    >
                        {affiliateCountries.map(countryObj => {
                            return  <Select.Option value={countryObj.countryCode}> 
                                {countryObj.countryFlag} {countryObj.countryName}
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