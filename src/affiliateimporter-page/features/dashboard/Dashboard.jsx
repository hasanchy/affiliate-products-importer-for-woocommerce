import { Card, Col, Row } from "antd";
import AmazonApiConnection from "./widgets/AmazonApiConnection";
import RecentlyImportedProducts from "./widgets/RecentlyImportedProducts";

const Dashboard = () => {
    return (
        <>
            {/* <Card title="">
                <AmazonApiConnection />
            </Card> */}
            <Row>
				<Col span={24}>
                    <AmazonApiConnection />
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