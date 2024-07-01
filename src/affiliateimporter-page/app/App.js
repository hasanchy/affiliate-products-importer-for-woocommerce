import { ErrorBoundary } from "react-error-boundary";
import { Alert, Button, Card, Col, Row, Space } from 'antd';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { __ } from '@wordpress/i18n';
import Header from "../components/Header";

const App = () => {

	useEffect(() => {

	}, [])


	return (
		<div className="wrap">
			<Header />
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<Card>

					
				</Card>
			</ErrorBoundary>
		</div>
	)
}

export default App;