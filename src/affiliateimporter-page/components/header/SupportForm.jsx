import { __ } from '@wordpress/i18n';
import { Button, Form, Input, Typography } from 'antd';
import React, { useState } from 'react';
const { TextArea } = Input;

const SupportForm = () => {
    const [form] = Form.useForm();
    const [message, setMessage] = useState('');

    const onFinish = (values) => {
        console.log('Received values:', values);
        // setMessage(__('Your message has been sent!', 'affiliate-products-importer-for-woocommerce'));
        // form.resetFields(); // Optionally reset the form fields after submission
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Typography.Paragraph>
                {__('If you need assistance, encounter any issues, or have suggestions, please reach out to us using the form below.', 'affiliate-products-importer-for-woocommerce')}
            </Typography.Paragraph>
            <Form
                name="basic"
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label={__( 'Your email address', 'affiliate-products-importer-for-woocommerce' )}
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input your email address!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                        {
                            type: 'email',
                            message: __( 'The input is not valid E-mail!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                    ]}
                >
                    <Input placeholder="Email..." />
                </Form.Item>
                <Form.Item
                    name="message"
                    label={__('Message', 'affiliate-products-importer-for-woocommerce')}
                    rules={[
                        {
                            required: true,
                            message: __( 'Please input your message!', 'affiliate-products-importer-for-woocommerce' ),
                        },
                    ]}
                >
                    <TextArea placeholder="Enter your message here." />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {__('Submit', 'affiliate-products-importer-for-woocommerce')}
                    </Button>
                </Form.Item>
            </Form>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Display success or error message here */}
        </>
    );
};

export default SupportForm;