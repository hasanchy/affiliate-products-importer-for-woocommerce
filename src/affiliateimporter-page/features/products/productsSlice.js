import { createSlice } from '@reduxjs/toolkit';
import { fetchRecentlyImportedProducts } from '../../services/apiService';

const initialState = {
    isProductsLoading: false,
	productList: '',
	totalProducts: ''
}

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
        
	},
	extraReducers: (builder) => {
        builder.addCase(fetchRecentlyImportedProducts.pending, (state) => {
			state.isProductsLoading = true;
		}),
		builder.addCase(fetchRecentlyImportedProducts.fulfilled, (state, action) => {
            state.isProductsLoading = false;
			state.productList = action.payload.products;
			state.totalProducts = action.payload.total;
		}),
		builder.addCase(fetchRecentlyImportedProducts.rejected, (state, action) => {
			state.isProductsLoading = false;
			state.AmazonApiConnectionStatus = 'error';
			state.AmazonApiConnectionMessage = action.payload?.message ? action.payload.message : 'Unable to connect to the API.';
        })
	}
})

export const { } = productsSlice.actions
export default productsSlice.reducer;