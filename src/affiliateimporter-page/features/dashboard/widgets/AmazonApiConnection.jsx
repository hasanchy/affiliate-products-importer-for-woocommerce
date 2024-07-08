import React, {memo} from 'react';
import { Alert, Card, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';

const { Link } = Typography;

const AmazonApiConnection = () => {

    const {IsAmazonApiConnectionLoading, AmazonApiConnectionStatus, AmazonApiConnectionMessage } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const renderLoadingMessage = () => {
        return <Alert
            message=""
            description="Your Amazon API connection is being verified."
            type="info"
            icon=<SyncOutlined spin />
            showIcon
        />
    }

    const renderSuccessMessage = () => {
        return <Alert
            message=""
            description="Your Amazon API connection is valid."
            type="success"
            showIcon
        />
    }

    const renderWarningMessage = () => {
        let description = <>Your Amazon API is not yet set up. You can set it up <Link onClick={handleAmazonApiSetup}>here</Link>.</>
        return <Alert
            message="Amazon API Connection Incomplete"
            description= {description}
            type="warning"
            showIcon
        />
    }

    const renderErrorMessage = () => {
        return <Alert
            message="Amazon API Connection Error"
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
        <Card title="Amazon API Connection">
            {renderApiStatus()}
        </Card>
    );
}

export default AmazonApiConnection;

// import React, {memo} from 'react';
// import { Alert, Typography } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { SyncOutlined } from '@ant-design/icons';
// // import { setActiveTab } from '../tabs/tabsSlice';
// // import { setSettingsActiveTab } from '../settings/settingsSlice';

// const { Link } = Typography;

// const AmazonApiConnection = memo(() => {	 
//     const {IsAmazonApiConnectionLoading, AmazonApiConnectionStatus, AmazonApiConnectionMessage } = useSelector((state) => state.dashboard);
//     const dispatch = useDispatch();

//     const renderLoadingMessage = () => {
//         return <Alert
//             message="Amazon API Connection"
//             description="Your Amazon API connection is being verified."
//             type="info"
//             icon=<SyncOutlined spin />
//             showIcon
//         />
//     }

//     const renderSuccessMessage = () => {
//         return <Alert
//             message="Amazon API Connection"
//             description="Your Amazon API connection is valid."
//             type="success"
//             showIcon
//         />
//     }

//     const handleAmazonApiSetup = () => {
//         // dispatch(setActiveTab('settings'))
//         // dispatch(setSettingsActiveTab('amazonApiSettings'));
//     }

//     const renderWarningMessage = () => {
//         return <Alert
//             message="Amazon API Connection Incomplete"
//             description=<>Your Amazon API is not yet set up. You can set it up <Link onClick={handleAmazonApiSetup}>here</Link>.</>
//             type="warning"
//             showIcon
//         />
//     }

//     const renderErrorMessage = () => {
//         return <Alert
//             message="Amazon API Connection Error"
//             description={AmazonApiConnectionMessage}
//             type="error"
//             showIcon
//         />
//     }

//     const renderApiStatus = () => {
//         if(IsAmazonApiConnectionLoading){
//             return renderLoadingMessage();
//         }else if(AmazonApiConnectionStatus === 'success'){
//             return renderSuccessMessage();
//         }else if(AmazonApiConnectionStatus === 'incomplete'){
//             return renderWarningMessage();
//         }else if(AmazonApiConnectionStatus === 'error'){
//             return renderErrorMessage();
//         }
        
//         return null;
//     }

//     return (
// 		<div>
// 			{renderApiStatus()}
// 		</div>
// 	)
// })

// export default AmazonApiConnection;