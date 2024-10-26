import { __ } from '@wordpress/i18n';

const Header = () => {
    return (<h1 style={{ fontFamily: 'Trebuchet MS',fontWeight:600, fontSize: '28px', marginBottom: '10px' }}><span style={{ color: '#eda93a' }}>{ __( 'Amazon Affiliate', 'affiliate-products-importer-for-woocommerce' ) }</span> <span style={{ color: '#674399' }}>{ __( 'Products Importer', 'affiliate-products-importer-for-woocommerce' ) }</span></h1>);
}

export default Header;