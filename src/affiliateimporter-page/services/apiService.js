import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { __ } from '@wordpress/i18n';

export const verifyAmazonApiConnection = createAsyncThunk('dashboard/amazonApiStatus', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(affprodimpAffiliateImporter.restEndpoint.amazonAPIConnection, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const verifyAmazonApiSettings = createAsyncThunk('settings/amazonApiSettings', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.amazonAPIConnection, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchRecentlyImportedProducts = createAsyncThunk('products/recentlyImported', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(affprodimpAffiliateImporter.restEndpoint.products, {
			params,
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(affprodimpAffiliateImporter.restEndpoint.products, {
			params,
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const saveProducts = createAsyncThunk('products/save', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.products, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const addProduct = createAsyncThunk('products/add', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.product, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (params, { rejectWithValue }) => {
	try {
		const res = await axios.get(affprodimpAffiliateImporter.restEndpoint.categories, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		console.error(__('Error fetching categories:', 'affiliate-products-importer-pro'), error); // Add this line for debugging
		return rejectWithValue(error.response.data);
	}
});

export const asinVerification = createAsyncThunk('asinVerification', async (data, { rejectWithValue }) => {
	try {
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.asinVerification, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const searchAmazonProducts = createAsyncThunk('searchAmazonProducts', async (data, { rejectWithValue }) => {
	try {
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.productSearch, data, {
			headers: {
					'content-type': 'application/json',
					'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchAmazonApiSettings = createAsyncThunk('fetchAmazonApiSettings', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(affprodimpAffiliateImporter.restEndpoint.amazonApiSettings, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const saveAmazonApiSettings = createAsyncThunk('saveAmazonApiSettings', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.amazonApiSettings, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const fetchImportSettings = createAsyncThunk('fetchImportSettings', async (params, { rejectWithValue }) => {
	try{
		const res = await axios.get(affprodimpAffiliateImporter.restEndpoint.importSettings, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const saveImportSettings = createAsyncThunk('saveImportSettings', async (data, { rejectWithValue }) => {
	try{
		const res = await axios.post(affprodimpAffiliateImporter.restEndpoint.importSettings, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const syncProducts = createAsyncThunk('products/sync', async (productIds, { rejectWithValue }) => {
	try {
		const res = await axios.post(
			`${affprodimpAffiliateImporter.restEndpoint.products}/sync`,
			{ product_ids: productIds },
			{
				headers: {
					'content-type': 'application/json',
					'X-WP-NONCE': affprodimpAffiliateImporter.restNonce
				}
			}
		);
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});