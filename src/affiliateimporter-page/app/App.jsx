import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { __ } from '@wordpress/i18n';
import Header from "../components/header/Header";
import MenuTabs from "../components/menu-tabs/MenuTabs";
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
			<ErrorBoundary fallback={<div>{ __( 'Something went wrong', 'affiliate-products-importer-for-woocommerce' ) }</div>}>
				<MenuTabs/>
			</ErrorBoundary>
		</div>
	)
}

export default App;