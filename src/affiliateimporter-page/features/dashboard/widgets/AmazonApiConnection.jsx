import React, {memo} from 'react';
import { Alert, Card, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';

const { Link } = Typography;

const AmazonApiConnection = () => {

    const {IsAmazonApiConnectionLoading, AmazonApiConnectionStatus, AmazonApiConnectionMessage } = useSelector((state) => state.dashboard);

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
            description={AmazonApiConnectionMessage}
            type="error"
            showIcon
        />
    }

    const renderApiStatus = () => {
        if(IsAmazonApiConnectionLoading){
            return renderLoadingMessage();
        }else if(AmazonApiConnectionStatus === 'success'){
            return renderSuccessMessage();
        }else if(AmazonApiConnectionStatus === 'incomplete'){
            return renderWarningMessage();
        }else if(AmazonApiConnectionStatus === 'error'){
            return renderErrorMessage();
        }
        
        return null;
    }

    return (
        <Card title={ __( 'Amazon API Connection', 'affiliate-products-importer' )}>
            {renderApiStatus()}
        </Card>
    );
}

export default AmazonApiConnection;