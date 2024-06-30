import { configureStore } from '@reduxjs/toolkit'
import gridReducer from "../features/grid/gridSlice";

const store = configureStore({
	reducer: {
		grid: gridReducer
	},
})

export default store;