import React, {memo} from 'react';
import { Alert, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import { setActiveTab } from '../../components/menu-tabs/manuTabsSlice';
import { setSettingsActiveTab } from '../../features/settings/settingsSlice';

const { Link } = Typography;

const AmazonApiConnection = () => {

    const {isAmazonApiConnectionLoading, amazonApiConnectionStatus, amazonApiConnectionMessage } = useSelector((state) => state.amazonApiConnection);
    const dispatch = useDispatch();

    const handleAmazonApiSetup = () => {
        dispatch( setActiveTab( 'settings' ) );
        dispatch( setSettingsActiveTab ( 'amazonApiSettings' ) );
    }

    const renderLoadingMessage = () => {
        return <Alert
            message=""
            description={ __( 'Your Amazon API connection is being verified.', 'affiliate-products-importer' )}
            type="info"
            icon=<SyncOutlined spin />
            showIcon
        />
    }

    const renderSuccessMessage = () => {
        return <Alert
            message=""
            description={ __( 'Your Amazon API connection is valid.', 'affiliate-products-importer' )}
            type="success"
            showIcon
        />
    }

    const renderWarningMessage = () => {
        let description = <>Your Amazon API is not yet set up. You can set it up <Link onClick={handleAmazonApiSetup}>here</Link>.</>
        return <Alert
            message={ __( 'Amazon API Connection Incomplete', 'affiliate-products-importer' )}
            description= {description}
            type="warning"
            showIcon
        />
    }

    const renderErrorMessage = () => {
        return <Alert
            message={ __( 'Amazon API Connection Error', 'affiliate-products-importer' )}
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