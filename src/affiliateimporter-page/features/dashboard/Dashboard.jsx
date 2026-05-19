import { Alert, Card, Col, Row, Space } from "antd";
import RecentlyImportedProducts from "./widgets/RecentlyImportedProducts";
import AmazonApiConnection from "../../components/amazon-api-connection/AmazonApiConnection";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from '../../components/menu-tabs/manuTabsSlice';
import { setSettingsActiveTab } from '../../features/settings/settingsSlice';
import { setAmazonApiType } from '../../features/settings/amazon-api-settings/amazonApiSettingsSlice';

const Dashboard = () => {
    
    const dispatch = useDispatch();
    const { amazonApiType } = useSelector((state) => state.amazonApiSettings);

    const handleAmazonApiSetup = () => {
        dispatch( setActiveTab( 'settings' ) );
        dispatch( setSettingsActiveTab ( 'amazonApiSettings' ) );
        dispatch( setAmazonApiType( 'creators_api' ) );
    }

    const renderAmazonApiConnectionAlert = () => {
        if (amazonApiType !== 'creators_api') {
            let description = <>{__( 'Amazon has deprecated the Product Advertising API. Please configure the', 'affiliate-products-importer-for-woocommerce' )} <a href="https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding" target="_blank"><b>{__( 'Amazon Creators API', 'affiliate-products-importer-for-woocommerce' )}</b></a> {__( 'in the', 'affiliate-products-importer-for-woocommerce' )} <a onClick={handleAmazonApiSetup}><b>{__( 'API Settings', 'affiliate-products-importer-for-woocommerce' )}</b></a> {__( 'to continue importing products.', 'affiliate-products-importer-for-woocommerce' )}</>;
            return (
                <Alert
                    description={ description }
                    type="warning"
                    showIcon
                />
            );
        }

        return <AmazonApiConnection />;
    };

    return (
        <>
            <Row>
				<Col span={24}>
                    <Card title={ __( 'Amazon API Connection', 'affiliate-products-importer-for-woocommerce' )}>
                        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                            {renderAmazonApiConnectionAlert()}
                        </Space>
                    </Card>
				</Col>
            </Row>
            <Row gutter={12} style={{marginTop:'10px'}}>
				<Col span={24}>
                    <RecentlyImportedProducts />
				</Col>
			</Row>
        </>
    );
}

export default Dashboard;