import React, {memo} from 'react';
import { Alert, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import { setActiveTab } from '../../components/menu-tabs/manuTabsSlice';
import { setSettingsActiveTab } from '../../features/settings/settingsSlice';
import { setProductsScreen } from '../../features/products/productsSlice';

const { Link } = Typography;

const AmazonApiConnection = () => {

    const {isAmazonApiConnectionLoading, amazonApiConnectionStatus, amazonApiConnectionMessage } = useSelector((state) => state.amazonApiConnection);
    const dispatch = useDispatch();

    const handleAmazonApiSetup = () => {
        dispatch( setActiveTab( 'settings' ) );
        dispatch( setSettingsActiveTab ( 'amazonApiSettings' ) );
    }

    const handleProductAdd = () => {
        dispatch( setActiveTab( 'products' ) );
        dispatch( setProductsScreen('add-new-product') );
    }

    const renderLoadingMessage = () => {
        return <Alert
            message=""
            description={ __( 'Your Amazon API connection is being verified.', 'affiliate-products-importer-for-woocommerce' )}
            type="info"
            icon=<SyncOutlined spin />
            showIcon
        />
    }

    const renderSuccessMessage = () => {
        return <Alert
            message=""
            description={ __( 'Your Amazon API connection is valid.', 'affiliate-products-importer-for-woocommerce' )}
            type="success"
            showIcon
        />
    }

    const renderWarningMessage = () => {
        let description = <Space size='small' direction='vertical' style={{
            display: 'flex',
        }}>
            <div>Your Amazon API is not set up yet. You can configure it <Link onClick={handleAmazonApiSetup}>here</Link>.</div>
            <div>Alternatively, you can manually add products from <Link onClick={handleProductAdd}>here</Link>.</div>
        </Space>
        return <Alert
            message={ __( 'Amazon API Connection Incomplete', 'affiliate-products-importer-for-woocommerce' )}
            description= {description}
            type="warning"
            showIcon
        />
    }

    const renderErrorMessage = () => {
        return <Alert
            message={ __( 'Amazon API Connection Error', 'affiliate-products-importer-for-woocommerce' )}
            description={amazonApiConnectionMessage}
            type="error"
            showIcon
        />
    }

    const renderApiStatus = () => {
        if(isAmazonApiConnectionLoading){
            return renderLoadingMessage();
        }else if(amazonApiConnectionStatus === 'success'){
            return renderSuccessMessage();
        }else if(amazonApiConnectionStatus === 'incomplete'){
            return renderWarningMessage();
        }else if(amazonApiConnectionStatus === 'error'){
            return renderErrorMessage();
        }
        
        return null;
    }

    return (
        <>
            {renderApiStatus()}
        </>
    );
}

export default AmazonApiConnection;