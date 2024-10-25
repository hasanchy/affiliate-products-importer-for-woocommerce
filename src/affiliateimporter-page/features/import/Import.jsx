import React from 'react';
import { Space } from 'antd';
import ImportSteps from './import-steps/ImportSteps';
import ImportTypeSelect from './import-type-select/ImportTypeSelect';
import ImportCopyPaste from './import-copy-paste/ImportCopyPaste';
import { useSelector } from 'react-redux';

const Import = () => {

    const { importType, importStepIndex } = useSelector((state) => state.import);

    const renderImportStepContent = () => {
        if(importStepIndex===0){
            return <ImportTypeSelect />;
        }else if(importType==='copy-paste'){
            return <ImportCopyPaste />
        }
        return null;
    }

	return (
		<React.Fragment>
			<Space
                direction='vertical'
                style={{
                    display: 'flex',
                }}
            >
                <ImportSteps />
                {renderImportStepContent()}
			</Space>
		</React.Fragment>
	)
}

export default Import;