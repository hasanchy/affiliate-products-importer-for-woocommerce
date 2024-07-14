import { createSlice } from '@reduxjs/toolkit';
import { fetchSettings } from '../../services/apiService';

const initialState = {
    settingsActiveTab: 'amazonApiSettings',
	amazonAccessKey: '',
	amazonSecretKey: '',
	amazonCountryCode: 'us',
	amazonAffiliateId: '',
	importRemoteAmazonImage: true,
	importProductPrice: true,
	importProductDescription: true,
	importProductAttributes: true,

	autoSync: true,
	autoSyncOccurence: 'everyday',
	syncProductName: true,
	syncProductPrice: true,
	syncProductThumbnail: true,
	syncProductDescription: true,
	syncProductAttributes: true,
	
	isSettingsLoading: false,
	isAmazonAPISettingsSaving: false,
	isImportSettingsSaving: false,
	isAmazonAPISettingsVerifying: false,
	isSyncSettingsSaving: false,
	error: null,
	message: '',
	settingsToastMessage: ''
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettingsActiveTab: (state, action) => {
			state.settingsActiveTab = action.payload;
		},
		setAmazonAccessKey: (state, action) => {
			state.amazonAccessKey = action.payload;
		},
		setAmazonSecretKey: (state, action) => {
			state.amazonSecretKey = action.payload;
		},
		setAmazonCountryCode: (state, action) => {
			state.amazonCountryCode = action.payload;
		},
		setAmazonAffiliateId: (state, action) => {
			state.amazonAffiliateId = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchSettings.pending, (state) => {
			state.isSettingsLoading = true;
		}),
		builder.addCase(fetchSettings.fulfilled, (state, action) => {
			state.isSettingsLoading = false;
			state.error = null;
			state.amazonAccessKey = action.payload.amazon_api_settings.access_key;
			state.amazonSecretKey = action.payload.amazon_api_settings.secret_key;
			state.amazonCountryCode = action.payload.amazon_api_settings.country_code;
			state.amazonAffiliateId = action.payload.amazon_api_settings.affiliate_id;
		}),
		builder.addCase(fetchSettings.rejected, (state, action) => {
			state.isSettingsLoading = false;
			state.error = (action.error?.message) ? action.error.message : null;
		})
	}
})

export const { setSettingsActiveTab, setAmazonAccessKey, setAmazonSecretKey, setAmazonCountryCode, setAmazonAffiliateId } = settingsSlice.actions
export default settingsSlice.reducer;