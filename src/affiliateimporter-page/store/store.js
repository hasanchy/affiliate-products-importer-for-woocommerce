import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from "../features/dashboard/dashboardSlice";
import productsSlice from '../features/products/productsSlice';
import importSlice from '../features/import/importSlice';
import importCopyPasteSlice from '../features/import/import-copy-paste/importCopyPasteSlice';
import categoriesSlice from '../components/categories/categoriesSlice';
import settingsSlice from '../features/settings/settingsSlice';

const store = configureStore({
	reducer: {
		dashboard: dashboardReducer,
		categories: categoriesSlice,
		products: productsSlice,
		import: importSlice,
		importCopyPaste: importCopyPasteSlice,
		settings: settingsSlice
	},
})

export default store;