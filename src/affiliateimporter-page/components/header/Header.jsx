import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Drawer, Button, Flex, Typography, Layout, Alert } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import SupportForm from './SupportForm';
const { Content } = Layout;

const Header = () => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <h1 style={{ fontFamily: 'Trebuchet MS', fontWeight: 600, fontSize: '28px', marginBottom: '10px' }}>
                <span style={{ color: '#eda93a' }}>{__( 'Amaz', 'affiliate-products-importer-for-woocommerce' )}</span>
                <span style={{ color: '#674399' }}>{__( 'Sync', 'affiliate-products-importer-for-woocommerce' )}</span>
            </h1>
            <Button 
                type="default" 
                icon={<CustomerServiceOutlined />} 
                style={{ float: 'right', marginTop: '-40px' }} 
                onClick={showDrawer}
            >
            </Button>
            <Drawer
                title={__('Feedback & Help', 'affiliate-products-importer-for-woocommerce')}
                placement="right"
                width={500}
                onClose={onClose}
                open={open}
                style={{ 
                    marginTop: '32px',
                    paddingBottom: '32px'	
                }}
            >
                <Layout style={{ height: "100%" }}> {/* Full viewport height */}
                    {/* Top Element */}
                    <Content 
                        style={{ 
                            flex: "none", 
                            padding: "0px",
                            background: "#fff",
                        }}
                    >
                        <SupportForm />
                    </Content>

                    {/* Bottom Element */}
                    <Content
                        style={{
                            flex: "1",
                            padding: "0px",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                        }}
                    >
                        {/* <Alert message="If you enjoy the plugin, we’d appreciate a 5-star review on WordPress.org. It helps us improve and grow. Thank you!" type="success" /> */}
                        <Typography.Title level={5}>
                        {__('If you enjoy the plugin, we’d appreciate a ', 'affiliate-products-importer-for-woocommerce')}
                            <a href="https://wordpress.org/support/plugin/wp-bulk-delete/reviews/#new-post" target="_blank" rel="noopener noreferrer">
                                {__('5-star review on WordPress.org.', 'affiliate-products-importer-for-woocommerce')}
                            </a>
                            {__(' It helps us improve and grow. Thank you!', 'affiliate-products-importer-for-woocommerce')}
                        </Typography.Title>
                        {/*<span style={{ margin: 0 }}>
                            {__('If you enjoy the plugin, we’d appreciate a ', 'affiliate-products-importer-for-woocommerce')}
                            <a href="https://wordpress.org/support/plugin/affiliate-products-importer-for-woocommerce/reviews/" target="_blank" rel="noopener noreferrer">
                                {__('5-star review on WordPress.org.', 'affiliate-products-importer-for-woocommerce')}
                            </a>
                            {__(' It helps us improve and grow. Thank you!', 'affiliate-products-importer-for-woocommerce')}
                        </span> */}
                    </Content>
                </Layout>
                {/* <SupportForm />
                <Flex justify="center" align="bottom">
                    <p style={{ margin: 0 }}>
                        {__('If you enjoy the plugin, we’d appreciate a ', 'affiliate-products-importer-for-woocommerce')}
                        <a href="https://wordpress.org/support/plugin/affiliate-products-importer-for-woocommerce/reviews/" target="_blank" rel="noopener noreferrer">
                            {__('5-star review on WordPress.org.', 'affiliate-products-importer-for-woocommerce')}
                        </a>
                        {__(' It helps us improve and grow. Thank you!', 'affiliate-products-importer-for-woocommerce')}
                    </p>
                </Flex>
                <Flex
                    vertical
                    align="flex-end"
                    justify="space-between"
                    style={{
                        padding: 5,
                    }}
                    height="100%"
                >
                    <Typography.Title level={3}>
                        “antd is an enterprise-class UI design language and React UI library.”
                    </Typography.Title>
                    <Button type="primary" href="https://ant.design" target="_blank">
                        Get Started
                    </Button>
                </Flex> */}
            </Drawer>
        </>
    );
};

export default Header;
