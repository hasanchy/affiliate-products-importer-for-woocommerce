import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from '../../services/apiService';

const initialState = {
    isProductsLoading: false,
	productList: '',
	totalProducts: '',
	searchKeyword: '',
}

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
        setSearchKeyword: (state, action) => {
			state.searchKeyword = action.payload
		},
	},
	extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
			state.isProductsLoading = true;
		}),
		builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.isProductsLoading = false;
			state.productList = action.payload.products;
			state.totalProducts = action.payload.total;
		}),
		builder.addCase(fetchProducts.rejected, (state, action) => {
			state.isProductsLoading = false;
			state.amazonApiConnectionStatus = 'error';
			state.amazonApiConnectionMessage = action.payload?.message ? action.payload.message : 'Unable to connect to the API.';
        })
	}
})

export const { setSearchKeyword } = productsSlice.actions
export default productsSlice.reducer;