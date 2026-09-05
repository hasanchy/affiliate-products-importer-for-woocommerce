import React from 'react';
import { Alert, Button, Card, Col, Image, Row, Space, Typography } from "antd";
import { CheckCircleOutlined } from '@ant-design/icons';
import { __ } from "@wordpress/i18n";

const ProFeatures = () => {
    
    return (
        <Card title="Upgrade to Pro">
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                <Row gutter={20}>
                    <Col span={16} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <a href='https://woocommerce.com/products/amazon-affiliate-product-importer/' target='_blank'>
                            <Image
                                preview={false}
                                src={window.affprodimpAffiliateImporter.assetsUrl + '/images/dashboard.png'} 
                                alt="Product Cleaner" style={{ width: '100%', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)' }}
                                
                            /> 
                        </a>
                    </Col>
                    <Col span={8} style={{ display: 'flex'}}>
                        <Space size={15} direction="vertical" style={{ width: '100%' }}>
                            <div><Typography.Title level={4} style={{marginTop: 0}}>{__( 'Upgrade to AmaSync (Pro) - Amazon Affiliate Product Importer', 'affiliate-products-importer-for-woocommerce' )}</Typography.Title></div>
                            <div>{__( 'With', 'affiliate-products-importer-for-woocommerce' )} <a href='https://woocommerce.com/products/amazon-affiliate-product-importer/' target='_blank'><b>{__( 'AmaSync (Pro) - Amazon Affiliate Product Importer', 'affiliate-products-importer-for-woocommerce' )}</b></a>{__( ', you can import and synchronize your WooCommerce products with Amazon using powerful tools and advanced features.', 'affiliate-products-importer-for-woocommerce' )}</div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Import products using advanced search and filtering', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Bulk import products using ASINs', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Automatically synchronize products with Amazon', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Automatically detect and assign product brands', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Save and reuse frequently used searches', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Quality-checked & officially listed on WooCommerce.com', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Migrate WZone products to AmaSync with a few clicks', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Enjoy priority support', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( 'Get all future updates and improvements', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div><CheckCircleOutlined style={{ color: '#52C41A', fontSize: '18px', marginRight: '8px' }} /> <Typography.Text strong>{__( '30-day money-back guarantee', 'affiliate-products-importer-for-woocommerce' )}</Typography.Text></div>
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <Button
                                    key="link"
                                    href="https://woocommerce.com/products/amazon-affiliate-product-importer/"
                                    type="primary"
                                    style={{ marginTop: '20px' }}
                                    target='_blank'
                                    size='large'
                                >
                                    { __( 'Upgrade Now' ) }
                                </Button>
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

export default ProFeatures;