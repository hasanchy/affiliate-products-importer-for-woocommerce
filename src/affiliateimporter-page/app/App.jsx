import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
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
			<ErrorBoundary fallback={<div>{ __( 'Something went wrong', 'affiliate-products-importer' ) }</div>}>
				<FeatureTabs/>
			</ErrorBoundary>
		</div>
	)
}

export default App;