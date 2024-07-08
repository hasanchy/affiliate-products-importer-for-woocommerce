import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchAmazonApiStatus } from '../../services/apiService';

const initialState = {
    IsAmazonApiConnectionLoading: false,
	AmazonApiConnectionStatus: '',
	AmazonApiConnectionMessage: ''
}

export const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {
        
	},
	extraReducers: (builder) => {
        builder.addCase(fetchAmazonApiStatus.pending, (state) => {
			state.IsAmazonApiConnectionLoading = true;
		}),
		builder.addCase(fetchAmazonApiStatus.fulfilled, (state, action) => {
            state.IsAmazonApiConnectionLoading = false;
			state.AmazonApiConnectionStatus = action.payload.status;
		}),
		builder.addCase(fetchAmazonApiStatus.rejected, (state, action) => {
			state.IsAmazonApiConnectionLoading = false;
			state.AmazonApiConnectionStatus = 'error';
			state.AmazonApiConnectionMessage = action.payload?.message ? action.payload.message : 'Unable to connect to the Amazon API. Please verify your Amazon API settings.';
        })
	}
})

export const { setPixels, resetPixels, setIsMouseDown, setSelectedColor } = dashboardSlice.actions
export default dashboardSlice.reducer;