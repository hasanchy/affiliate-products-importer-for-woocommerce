import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from '../../services/apiService';

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
	},
	extraReducers: (builder) => {}
})

export const { setSettingsActiveTab } = settingsSlice.actions
export default settingsSlice.reducer;