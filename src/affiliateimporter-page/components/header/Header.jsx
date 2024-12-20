import { __ } from '@wordpress/i18n';
import Support from '../support/Support';
import { Col, Row, Button, Space } from 'antd';

const Header = () => {
    
    return (
        <Row>
            <Col span={12}>
                <h1 style={{ fontFamily: 'Trebuchet MS', fontWeight: 600, fontSize: '28px', marginBottom: '10px' }}>
                    <span style={{ color: '#eda93a' }}>{__( 'Amaz', 'affiliate-products-importer-for-woocommerce' )}</span>
                    <span style={{ color: '#674399' }}>{__( 'Sync', 'affiliate-products-importer-for-woocommerce' )}</span>
                    <span style={{ color: '#674399', fontWeight: 200, fontSize: '16px' }}>{__( ' (Lite)', 'affiliate-products-importer-for-woocommerce' )}</span>
                </h1>
            </Col>
            <Col span={12} style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                <Button
                    key="link"
                    href="https://1.envato.market/vPDEKj"
                    type="primary"
                    style={{ marginRight: '10px' }}
                >
                    { __( 'Upgrade to Pro' ) }
                </Button>
                <Support ratingUrl='https://wordpress.org/support/plugin/affiliate-products-importer-for-woocommerce/reviews/?rate=5#new-post'/>
            </Col>
        </Row>
    );
};

export default Header;
