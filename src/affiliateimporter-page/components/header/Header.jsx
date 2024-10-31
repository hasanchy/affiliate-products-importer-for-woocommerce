import { __ } from '@wordpress/i18n';
import Support from '../support/Support';
import { Col, Row } from 'antd';

const Header = () => {
    
    return (
        <Row>
            <Col span={12}>
                <h1 style={{ fontFamily: 'Trebuchet MS', fontWeight: 600, fontSize: '28px', marginBottom: '10px' }}>
                    <span style={{ color: '#eda93a' }}>{__( 'Amaz', 'affiliate-products-importer-for-woocommerce' )}</span>
                <span style={{ color: '#674399' }}>{__( 'Sync', 'affiliate-products-importer-for-woocommerce' )}</span>
                </h1>
            </Col>
            <Col span={12} style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                <Support ratingUrl='https://wordpress.org/support/plugin/affiliate-products-importer-for-woocommerce/reviews/?rate=5#new-post'/>
            </Col>
        </Row>
    );
};

export default Header;
