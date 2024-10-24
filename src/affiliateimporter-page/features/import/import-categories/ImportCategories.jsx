import React from 'react';
import { Row, Col, Space, Flex, Button, Card } from 'antd';
import CategoriesCheckbox from '../../../components/categories/CategoriesCheckbox';
import { useDispatch } from 'react-redux'
import { setImportStepBack, setImportStepNext } from '../importSlice';
import { __ } from '@wordpress/i18n';

const ImportCategories = ( {selectedCategories, onChange } ) => {

	const dispatch = useDispatch();
    
	const handleCategoriesChange = (values) => {
		onChange(values);
	}

    const handleImportStepBack = () => {
        dispatch(setImportStepBack());
    }

    const handleImportStepNext = () => {
        dispatch(setImportStepNext());
    }

	return (
		<React.Fragment>
            <Card>
                <Space
                    direction='vertical'
                    size="large"
                    style={{
                        display: 'flex',
                    }}
                >
                    <Row gutter={20}>
                        <Col span={4}>
                            <Flex style={{height:'100%'}} justify='flex-end' align='center'>
                                {  __( 'Import in', 'affiliate-products-importer-for-woocommerce' ) }
                            </Flex>
                        </Col>
                        <Col span={20}>
                            <CategoriesCheckbox value={selectedCategories} onChange={handleCategoriesChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}> 
                            <Flex justify='flex-start'>
                                <Button type="default" onClick={handleImportStepBack}>{ __( 'Back', 'affiliate-products-importer-for-woocommerce' ) }</Button>
                            </Flex>
                        </Col>
                        <Col span={12}>
                            <Flex justify='flex-end'>
                                <Button type="primary" onClick={handleImportStepNext} disabled={!selectedCategories.length}>{ __( 'Next', 'affiliate-products-importer-for-woocommerce' ) }</Button>
                            </Flex>
                        </Col>
                    </Row>
                </Space>
            </Card>
		</React.Fragment>
	)
}

export default ImportCategories;