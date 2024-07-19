import { __ } from '@wordpress/i18n';

const Header = () => {
    return (<h1 style={{ fontFamily: 'Trebuchet MS',fontWeight:600, fontSize: '30px', marginBottom: '10px' }}><span style={{ color: '#674399' }}>{ __( 'Affiliate', 'affiliate-products-importer' ) }</span> <span style={{ color: '#eda93a' }}>{ __( 'Products', 'affiliate-products-importer' ) }</span> <span style={{ color: '#674399' }}>{ __( 'Importer', 'affiliate-products-importer' ) }</span></h1>);
}

export default Header;