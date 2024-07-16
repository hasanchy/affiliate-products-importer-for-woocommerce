import { ErrorBoundary } from "react-error-boundary";
import { Alert, Button, Card, Col, Row, Space } from 'antd';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { __ } from '@wordpress/i18n';
import Header from "../components/header/Header";
import FeatureTabs from "../components/feature-tabs/FeatureTabs";
import { verifyAmazonApiConnection, fetchCategories, fetchProducts, fetchRecentlyImportedProducts, fetchAmazonApiSettings, fetchImportSettings } from "../services/apiService";

const App = () => {

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCategories());
		dispatch(verifyAmazonApiConnection());
		dispatch(fetchRecentlyImportedProducts({per_page:20}));
		dispatch(fetchProducts());
		dispatch(fetchAmazonApiSettings());
		dispatch(fetchImportSettings());
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