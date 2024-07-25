import React from 'react';
import { Card, Space } from 'antd';
import ImportSteps from './import-steps/ImportSteps';
import ImportTypeSelect from './import-type-select/ImportTypeSelect';
import ImportCopyPaste from './import-copy-paste/ImportCopyPaste';

const Import = () => {
	return (
		<React.Fragment>
			<Space
                direction='vertical'
                style={{
                    display: 'flex',
                }}
            >
                <ImportSteps />
                <ImportTypeSelect />
                <ImportCopyPaste />
			</Space>
		</React.Fragment>
	)
}

export default Import;