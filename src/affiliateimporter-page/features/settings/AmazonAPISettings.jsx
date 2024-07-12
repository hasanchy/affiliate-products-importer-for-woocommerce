import { Alert, Button, Form, Input, Select } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AU, BE, BR, CA, CN, EG, FR, DE, IN, IT, JP, MX, NL, PL, SA, SG, ES, SE, TR, AE, US, GB } from 'country-flag-icons/react/3x2'
// import { setAmazonAccessKey, setAmazonSecretKey, setAmazonCountryCode, setAmazonAffiliateId, saveSettings, verifyAmazonAPISettings, saveSyncSettings } from './settingsSlice';

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

const AmazonAPISettings = () => {

	const dispatch = useDispatch();
	const { amazonAccessKey, amazonSecretKey, amazonCountryCode, amazonAffiliateId, isSettingsLoading, isAmazonAPISettingsSaving, isAmazonAPISettingsVerifying, error } = useSelector((state) => state.settings);

    const [form] = Form.useForm();

    form.setFieldsValue({ 
        amazonAccessKey,
        amazonSecretKey,
        amazonAffiliateId,
        amazonCountryCode
    });

    const handleVerifyAmazonAPISettings = () => {

    }

    const onFieldsChange = (values) => {
        // let fieldName = values[0].name[0];
        // let fieldValue = values[0].value;
        // if(fieldName == 'amazonAccessKey'){
        //     dispatch(setAmazonAccessKey(fieldValue));
        // }else if(fieldName == 'amazonSecretKey'){
        //     dispatch(setAmazonSecretKey(fieldValue));
        // }else if(fieldName == 'amazonAffiliateId'){
        //     dispatch(setAmazonAffiliateId(fieldValue));
        // }else if(fieldName == 'amazonCountryCode'){
        //     dispatch(setAmazonCountryCode(fieldValue));
        // }
    }

    const onFinish = (values) => {
        // dispatch(saveSettings(values));
    };
    
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    const renderSaveButton = () => {
        let buttonText;
        if(isAmazonAPISettingsVerifying){
            buttonText = 'Verifying...'
        }else if(isAmazonAPISettingsSaving){
            buttonText = 'Saving...'
        }else{
            buttonText = 'Verify & Save'
        }

        return <Button type="primary" disabled={amazonAccessKey=='' || amazonSecretKey=='' || amazonAffiliateId==''} onClick={handleVerifyAmazonAPISettings} loading={isAmazonAPISettingsVerifying || isAmazonAPISettingsSaving}>
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
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Amazon AWS Access Key"
                    name="amazonAccessKey"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Access Key!',
                        },
                    ]}
                >
                    <Input value={amazonAccessKey}/>
                </Form.Item>

                <Form.Item
                    label="Amazon AWS Secret Key"
                    name="amazonSecretKey"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Secret Key!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Amazon Affiliate ID"
                    name="amazonAffiliateId"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your affiliate ID!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="amazonCountryCode"
                    label="Amazon Country"
                    rules={[
                        {
                            required: true,
                            message: 'Please select Amazon Country!',
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

export default AmazonAPISettings;