import React from 'react';
import { Card, Space } from 'antd';
import ImportSteps from './import-steps/ImportSteps';
import ImportTypeSelect from './import-type-select/ImportTypeSelect';
import { useSelector } from 'react-redux';
import ImportCopyPaste from './import-copy-paste/ImportCopyPaste';

const Import = () => {
    const { importStepIndex, importType } = useSelector((state) => state.import);

	return (
		<React.Fragment>
			<Space
                direction='vertical'
                style={{
                    display: 'flex',
                }}
            >
                <Card>
                    <ImportSteps />
                </Card>
                <>	
                    <ImportTypeSelect />
                    <ImportCopyPaste />
                </>
			</Space>
		</React.Fragment>
	)
}

export default Import;