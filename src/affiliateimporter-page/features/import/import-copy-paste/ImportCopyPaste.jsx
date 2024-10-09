import React from 'react';
import { Space } from 'antd';
import ImportCopyPasteForm from './ImportCopyPasteForm';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from '../../../components/product-list/ProductList';
import ImportBulk from '../import-bulk/ImportBulk';
import ImportCategories from '../import-categories/ImportCategories';
import { setSelectedCategories, setDeletedAsins, resetState } from './importCopyPasteSlice';

const ImportCopyPaste = () => {

    const dispatch = useDispatch();
    const { importStepIndex } = useSelector((state) => state.import);
    const { selectedCategories, importFetchItems, importFetchErrors, importableItems, deletedAsins } = useSelector((state) => state.importCopyPaste);

	let importFetchList = [...importFetchItems, ...importFetchErrors]

    const handleCategoryChange = (values) => {
        dispatch(setSelectedCategories(values));
    }

    const handleDeletedAsinsChange = ( newDeletedAsins ) => {
		dispatch(setDeletedAsins(newDeletedAsins));
    }

    const handleImportComplete = () => {
        dispatch(resetState());
    }

    return (
		<React.Fragment>
            <Space direction='vertical'
                style={{
                    display: 'flex',
                }}>
                {importStepIndex===1 && (
                    <>
                        <ImportCopyPasteForm />
                        <ProductList data={importFetchList} title={`ASIN Verification Result`}/>
                    </>
                )}
                {importStepIndex===2 && (
                    <>
                        <ImportCategories selectedCategories={selectedCategories} onChange={handleCategoryChange}/>
                    </>
                )}
                {importStepIndex===3 && (
                    <>
                        <ImportBulk selectedCategories={selectedCategories} importableItems={importableItems} deletedAsins={deletedAsins} onDeletedAsinsChange={handleDeletedAsinsChange} onImportComplete={handleImportComplete}/>
                    </>
                )}
			</Space>
		</React.Fragment>
	)
}

export default ImportCopyPaste;