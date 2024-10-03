import { Card, Col, Row } from "antd";
import RecentlyImportedProducts from "./widgets/RecentlyImportedProducts";
import AmazonApiConnection from "../../components/amazon-api-connection/AmazonApiConnection";
import { __ } from "@wordpress/i18n";

const Dashboard = () => {
    return (
        <>
            <Row>
				<Col span={24}>
                    <Card title={ __( 'Amazon API Connection', 'affiliate-products-importer-for-woocommerce' )}>
                        <AmazonApiConnection />
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