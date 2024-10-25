import React from 'react';
import { Alert } from 'antd';

const AlertView = ( {type, message, description} ) => {
    return (
        <Alert
            message={message}
            description={description}
            type={type}
            showIcon
        />
    );
}

export default AlertView;