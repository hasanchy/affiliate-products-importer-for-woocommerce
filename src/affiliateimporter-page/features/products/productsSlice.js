import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	productsScreen: 'default'
}

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setProductsScreen: (state, action) => {
			state.productsScreen = action.payload
		}
	}
})

export const { setProductsScreen } = productsSlice.actions
export default productsSlice.reducer;