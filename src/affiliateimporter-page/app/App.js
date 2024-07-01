import { ErrorBoundary } from "react-error-boundary";
import { Alert, Button, Card, Col, Row, Space } from 'antd';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { __ } from '@wordpress/i18n';

const App = () => {
	const dispatch = useDispatch();

	const { pixelData, savedPixelData, isPixelDataFetching, isPixelDataSaving, alert } = useSelector((state) => state.grid);
	const buttonDisabled = (isPixelDataFetching || JSON.stringify(pixelData) === JSON.stringify(savedPixelData)) ? true : false;

	useEffect(() => {

	}, [])


	return (
		<div className="wrap">
			<h1 style={{ fontFamily: 'Trebuchet MS',fontWeight:500, fontSize: '35px', marginBottom: '15px' }}><span style={{ color: '#eda93a' }}>Affiliate</span> <span style={{ color: '#674399' }}>Importer</span> <span style={{ color: '#eda93a' }}></span></h1>
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<Card>

					<Row justify="center">
						<Col>
							
						</Col>
					</Row>
					{alert.type && alert.message &&
						<Row justify="center">
							<div direction="vertical" size="middle" style={{ marginTop: '20px' }}>
								<Alert message={alert.message} type={alert.type} closable={true}/>
							</div>
						</Row>
					}
				</Card>
			</ErrorBoundary>
		</div>
	)
}

export default App;