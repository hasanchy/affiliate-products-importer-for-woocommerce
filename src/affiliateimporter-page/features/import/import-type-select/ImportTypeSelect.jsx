import React from 'react';
import { Card, Row, Col, Flex, Button, Space } from 'antd';
import ImportTypeCards from './ImportTypeCards';
import { FileSearchOutlined, CopyOutlined, FormOutlined } from '@ant-design/icons';

import { setImportType, setImportStepNext } from '../importSlice';
import { useDispatch, useSelector } from 'react-redux';
import { __ } from '@wordpress/i18n';


const ImportTypeSelect = () => {

    const dispatch = useDispatch();
    const { importType } = useSelector((state) => state.import);

    const handleImportTypeSelect = (type) => {
        dispatch(setImportType(type));
    }

    const handleImportStep = () => {
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
                    <ImportTypeCards
                        defaultSelectedKey={importType}
                        items={[
                            {
                                key: 'search-keyword',
                                label: __( 'Import via Product Search', 'affiliate-products-importer-for-woocommerce' ),
                                icon: <FileSearchOutlined/>,
                                isPro: true
                            },
                            {
                                key: 'copy-paste',
                                label: __( 'Import via ASIN', 'affiliate-products-importer-for-woocommerce' ),
                                icon: <CopyOutlined/>
                            },
                            {
                                key: 'manual-entry',
                                label: __( 'Manual Product Entry', 'affiliate-products-importer-for-woocommerce' ),
                                icon: <FormOutlined/>
                            }
                        ]}
                        onClick={handleImportTypeSelect}
                    />
                    <Row>
                        <Col span={12}>
                        </Col>
                        <Col span={12}>
                            <Flex justify='flex-end'>
                                <Button type="primary" disabled={!importType} onClick={handleImportStep.bind(this,1)}>{ __( 'Next', 'affiliate-products-importer-for-woocommerce' ) }</Button>
                            </Flex>
                        </Col>
                    </Row>
                </Space>
            </Card>
        </React.Fragment>
    )
}

export default ImportTypeSelect;