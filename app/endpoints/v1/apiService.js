import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAmazonApiStatus = createAsyncThunk('dashboard/amazonApiStatus', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.get(afltimptrAffiliateImporter.restEndpoint.amazonAPIConnection, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': afltimptrAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchRecentlyImportedProducts = createAsyncThunk('products', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(afltimptrAffiliateImporter.restEndpoint.products, {
			params,
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': afltimptrAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});