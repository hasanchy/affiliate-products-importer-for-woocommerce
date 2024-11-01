import { createSlice } from '@reduxjs/toolkit';
import { addProduct } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const initialState = {
    productUrl: '',
    asinNumber: '',
    productTitle: '',
    productDescription: '',
    regularPrice: '',
    salePrice: '',
    primaryImageUrl: '',
    productCategories: [],
    isProductAdding: false,
    productAddSuccessful: false,
    error: '',
    lastSavedProduct: null
}

export const importManualEntrySlice = createSlice({
	name: 'importManualEntry',
	initialState: initialState,
	reducers: {
		setProductUrl: (state, action) => {
			state.productUrl = action.payload;
		},
		setAsinNumber: (state, action) => {
			state.asinNumber = action.payload;
		},
		setProductTitle: (state, action) => {
			state.productTitle = action.payload;
		},
		setProductDescription: (state, action) => {
			state.productDescription = action.payload;
		},
		setRegularPrice: (state, action) => {
			state.regularPrice = action.payload;
		},
		setSalePrice: (state, action) => {
			state.salePrice = action.payload;
		},
		setPrimaryImageUrl: (state, action) => {
			state.primaryImageUrl = action.payload;
		},
		setProductCategories: (state, action) => {
			state.productCategories = action.payload;
		},
		setProductAddSuccessful: (state, action) => {
			state.productAddSuccessful = action.payload;
		},
		resetState: () => initialState
	},
	extraReducers: (builder) => {
		builder.addCase(addProduct.pending, (state) => {
			state.isProductAdding = true;
			state.productAddSuccessful = null;
			state.error = '';
		}),
		builder.addCase(addProduct.fulfilled, (state, action) => {
			state.isProductAdding = false;
			state.productAddSuccessful = true;
			state.lastSavedProduct = action.payload;
			state.error = '';
		}),
		builder.addCase(addProduct.rejected, (state, action) => {
			state.isProductAdding = false;
			state.productAddSuccessful = false;
			state.error = action.payload?.message ? __(action.payload.message, 'affiliate-products-importer-for-woocommerce') : __('An error occurred while adding the product.', 'affiliate-products-importer-for-woocommerce');
		})
	}
})

export const { setProductUrl, setAsinNumber, setProductTitle, setProductDescription, setRegularPrice, setSalePrice, setPrimaryImageUrl, setProductCategories, setProductAddSuccessful, resetState } = importManualEntrySlice.actions

export default importManualEntrySlice.reducer
