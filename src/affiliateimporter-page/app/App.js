import { ErrorBoundary } from "react-error-boundary";
import { Alert, Button, Card, Col, Row, Space } from 'antd';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { __ } from '@wordpress/i18n';
import Header from "../components/Header";
import FeatureTabs from "../components/FeatureTabs";
import { fetchAmazonApiStatus, fetchRecentlyImportedProducts } from "../services/apiService";

const App = () => {

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAmazonApiStatus());
		dispatch(fetchRecentlyImportedProducts({per_page:20}));
	}, [])


	return (
		<div className="wrap">
			<Header />
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<FeatureTabs/>
			</ErrorBoundary>
		</div>
	)
}

export default App;