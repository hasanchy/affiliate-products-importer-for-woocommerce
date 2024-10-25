import { createSlice } from '@reduxjs/toolkit';
import { saveProducts } from '../../../services/apiService';

const initialState = {
	importSuccessfulAsins: [],
	error: '',
};

export const importBulkSlice = createSlice({
	name: 'importBulk',
	initialState,
	reducers: {
		setImportSuccessfulAsins: (state, action) => {
			state.importSuccessfulAsins = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(saveProducts.pending, (state) => {
			state.error = '';
		}),
		builder.addCase(saveProducts.fulfilled, (state, action) => {
			state.importSuccessfulAsins = [...state.importSuccessfulAsins, ...action.payload.product_asins];
		}),
		builder.addCase(saveProducts.rejected, (state, action) => {
			state.error = action.payload?.message;
		});
	}
});

// Action creators are generated for each case reducer function
export const { 
	setImportSuccessfulAsins 
} = importBulkSlice.actions;

export default importBulkSlice.reducer;