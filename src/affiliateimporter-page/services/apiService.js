import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const verifyAmazonApiConnection = createAsyncThunk('dashboard/amazonApiStatus', async (params, { rejectWithValue }) => {
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

export const verifyAmazonApiSettings = createAsyncThunk('settings/amazonApiSettings', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(afltimptrAffiliateImporter.restEndpoint.amazonAPIConnection, data, {
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

export const fetchRecentlyImportedProducts = createAsyncThunk('products/recentlyImported', async (params, { rejectWithValue }) => {
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

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
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

export const saveProducts = createAsyncThunk('products/save', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(afltimptrAffiliateImporter.restEndpoint.products, data, {
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

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(afltimptrAffiliateImporter.restEndpoint.categories, {
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

export const asinVerification = createAsyncThunk('asinVerification', async (data, {rejectWithValue}) => {
	try{
		const res = await axios.post(afltimptrAffiliateImporter.restEndpoint.asinVerification, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': appLocalizer.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchAmazonApiSettings = createAsyncThunk('fetchAmazonApiSettings', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(afltimptrAffiliateImporter.restEndpoint.amazonApiSettings, {
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

export const saveAmazonApiSettings = createAsyncThunk('saveAmazonApiSettings', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(afltimptrAffiliateImporter.restEndpoint.amazonApiSettings, data, {
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

export const fetchImportSettings = createAsyncThunk('fetchImportSettings', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(afltimptrAffiliateImporter.restEndpoint.importSettings, {
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

export const saveImportSettings = createAsyncThunk('saveImportSettings', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(afltimptrAffiliateImporter.restEndpoint.importSettings, data, {
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