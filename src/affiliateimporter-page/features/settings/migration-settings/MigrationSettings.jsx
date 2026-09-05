import { Col, Row, Space } from 'antd';
import { __ } from '@wordpress/i18n';

import WzoneMigrationOverview from './WzoneMigrationOverview';

const MigrationSettings = () => {
    return (
        <>
            <Row gutter={16}>
                <Col span={16}>
                    <Space style={{display:'flex'}} direction='vertical' size={'large'}>
                        <WzoneMigrationOverview />
                    </Space>
                </Col>
            </Row>
        </>
    )
}

export default MigrationSettings;
