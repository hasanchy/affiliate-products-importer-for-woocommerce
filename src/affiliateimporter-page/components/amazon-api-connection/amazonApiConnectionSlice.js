import { createSlice } from '@reduxjs/toolkit';
import { verifyAmazonApiConnection } from '../../services/apiService';

const initialState = {
    isAmazonApiConnectionLoading: false,
	amazonApiConnectionStatus: '',
	amazonApiConnectionMessage: ''
}

export const amazonApiConnectionSlice = createSlice({
	name: 'amazonApiConnection',
	initialState,
	reducers: {
        setAmazonApiConnectionStatus: (state, action) => {
			state.amazonApiConnectionStatus = action.payload
		},
	},
	extraReducers: (builder) => {
        builder.addCase(verifyAmazonApiConnection.pending, (state) => {
			state.isAmazonApiConnectionLoading = true;
		}),
		builder.addCase(verifyAmazonApiConnection.fulfilled, (state, action) => {
            state.isAmazonApiConnectionLoading = false;
			state.amazonApiConnectionStatus = action.payload.status;
		}),
		builder.addCase(verifyAmazonApiConnection.rejected, (state, action) => {
			state.isAmazonApiConnectionLoading = false;
			state.amazonApiConnectionStatus = action.payload?.error?.code ? action.payload.error.code : 'error';
			state.amazonApiConnectionMessage = action.payload?.message ? action.payload.message : 'Unable to connect to the Amazon API. Please verify your Amazon API settings.';
        })
	}
})

export const { setAmazonApiConnectionStatus } = amazonApiConnectionSlice.actions;
export default amazonApiConnectionSlice.reducer;