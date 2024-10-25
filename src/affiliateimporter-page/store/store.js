import { configureStore } from '@reduxjs/toolkit'
import menuTabsReducer from "../components/menu-tabs/manuTabsSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import productsSlice from '../features/products/productsSlice';
import importSlice from '../features/import/importSlice';
import importCopyPasteSlice from '../features/import/import-copy-paste/importCopyPasteSlice';
import categoriesSlice from '../components/categories/categoriesSlice';
import settingsSlice from '../features/settings/settingsSlice';
import amazonApiSettingsSlice from '../features/settings/amazon-api-settings/amazonApiSettingsSlice';
import importSettingsSlice from '../features/settings/import-settings/importSettingsSlice';
import amazonApiConnectionSlice from '../components/amazon-api-connection/amazonApiConnectionSlice';
import productTableSlice from '../features/products/product-table/productTableSlice';
import productAddSlice from '../features/products/product-add/productAddSlice';
import importBulkSlice from '../features/import/import-bulk/importBulkSlice';

const store = configureStore({
	reducer: {
		menuTabs: menuTabsReducer,
		dashboard: dashboardReducer,
		categories: categoriesSlice,
		products: productsSlice,
		productTable: productTableSlice,
		productAdd: productAddSlice,
		import: importSlice,
		importCopyPaste: importCopyPasteSlice,
		importBulk: importBulkSlice,
		settings: settingsSlice,
		amazonApiSettings: amazonApiSettingsSlice,
		importSettings: importSettingsSlice,
		amazonApiConnection: amazonApiConnectionSlice
	},
})

export default store;