import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from "../features/dashboard/dashboardSlice";
import productsSlice from '../features/products/productsSlice';
import importSlice from '../features/import/importSlice';
import importCopyPasteSlice from '../features/import/import-copy-paste/importCopyPasteSlice';
import categoriesSlice from '../components/categories/categoriesSlice';

const store = configureStore({
	reducer: {
		dashboard: dashboardReducer,
		categories: categoriesSlice,
		products: productsSlice,
		import: importSlice,
		importCopyPaste: importCopyPasteSlice
	},
})

export default store;