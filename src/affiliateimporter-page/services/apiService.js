import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAmazonApiStatus = createAsyncThunk('dashboard/amazonApiStatus', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.get(affimportrAffiliateImporter.restEndpointAmazonApiConnection, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affimportrAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});