import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from "../features/dashboard/dashboardSlice";
import productsSlice from '../features/products/productsSlice';

const store = configureStore({
	reducer: {
		dashboard: dashboardReducer,
		products: productsSlice
	},
})

export default store;