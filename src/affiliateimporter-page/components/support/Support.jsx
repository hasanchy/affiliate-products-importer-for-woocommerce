import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Drawer, Button, Typography, Row, Col } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import SupportForm from './SupportForm';

const Support = ({ ratingUrl }) => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
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
                width={600}
                onClose={onClose}
                open={open}
                style={{ 
                    marginTop: '32px',
                    paddingBottom: '32px'	
                }}
            >
                <Row>
                    <Col span={24}>
                        <SupportForm />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Typography.Title level={5}>
                            {__('If you enjoy the plugin, we’d appreciate a ', 'affiliate-products-importer-for-woocommerce')}
                            <a href={ratingUrl} target="_blank" rel="noopener noreferrer">
                                {__('5-star review on WordPress.org.', 'affiliate-products-importer-for-woocommerce')}
                            </a>
                            {__(' It helps us improve and grow. Thank you!', 'affiliate-products-importer-for-woocommerce')}
                        </Typography.Title>
                    </Col>
                </Row>
            </Drawer>
        </>
    );
};

export default Support;
