import React from 'react';
import { Space } from 'antd';
import ImportCopyPasteForm from './ImportCopyPasteForm';
import ImportFetchResult from './ImportFetchResult';
import ImportCopyPasteFinal from './ImportCopyPasteFinal';
import ImportProductQueue from './ImportProductQueue';
import { useSelector } from 'react-redux';

const ImportCopyPaste = () => {

    const { importStepIndex } = useSelector((state) => state.import);

    return (
		<React.Fragment>
            <Space direction='vertical'
                style={{
                    display: 'flex',
                }}>
                {importStepIndex===1 && (
                    <>
                        <ImportCopyPasteForm />
                        <ImportFetchResult />
                    </>
                )}
                {importStepIndex===2 && (
                    <>
                        <ImportCopyPasteFinal />
                        <ImportProductQueue />
                    </>
                )}
			</Space>
		</React.Fragment>
	)
}

export default ImportCopyPaste;