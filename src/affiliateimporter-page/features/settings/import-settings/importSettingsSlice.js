import { createSlice } from '@reduxjs/toolkit';
import { fetchAmazonApiSettings, fetchImportSettings, saveAmazonApiSettings, saveImportSettings, verifyAmazonApiSettings } from '../../../services/apiService';

const initialState = {
	importRemoteAmazonImage: true,
	importProductType: 'external',
	importGalleryImages: true,
	importProductPrice: true,
	importProductAttributes: true,
	isImportSettingsLoading: false,
	isImportSettingsSaving: false,

	error: null,
	message: '',
	settingsToastMessage: ''
}

export const importSettingsSlice = createSlice({
	name: 'importSettings',
	initialState,
	reducers: {
		setSettingsToastMessage: (state, action) => {
			state.settingsToastMessage = action.payload;
		},
		setRemoteAmazonImage: (state, action) => {
			state.importRemoteAmazonImage = action.payload;
		},
		setImportProductType: (state, action) => {
			state.importProductType = action.payload;
		},
		setSettingsGalleryImages:(state, action) => {
			state.importGalleryImages = action.payload;
		},
		setSettingsProductPrice:(state, action) => {
			state.importProductPrice = action.payload;
		},
		setSettingsProductAttributes:(state, action) => {
			state.importProductAttributes = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchImportSettings.pending, (state) => {
			state.isImportSettingsLoading = true;
		}),
		builder.addCase(fetchImportSettings.fulfilled, (state, action) => {
			state.isImportSettingsLoading = false;
			state.importRemoteAmazonImage = action.payload.remote_image === 'yes' ? true: false;
			state.importProductType = action.payload.product_type === 'simple' ? 'simple': 'external';
			state.importGalleryImages = action.payload.gallery_images === 'yes' ? true: false;
			state.importProductPrice = action.payload.product_price === 'yes' ? true: false;
			state.importProductDescription = action.payload.product_description === 'yes' ? true: false;
			state.importProductAttributes = action.payload.product_attributes === 'yes' ? true: false;
			state.error = null;
		}),
		builder.addCase(fetchImportSettings.rejected, (state, action) => {
			state.isImportSettingsLoading = false;
			state.error = (action.error?.message) ? action.error.message : null;
		}),
		builder.addCase(saveImportSettings.pending, (state) => {
			state.isImportSettingsSaving = true;
		}),
		builder.addCase(saveImportSettings.fulfilled, (state, action) => {
			state.isImportSettingsSaving = false;
			state.error = null;
			state.settingsToastMessage = 'All the import settings have been saved successfully';
		}),
		builder.addCase(saveImportSettings.rejected, (state, action) => {
			state.isImportSettingsSaving = false;
			state.error = (action.error?.message) ? action.error.message : null;
		})
	}
})

export const { setSettingsToastMessage, setRemoteAmazonImage, setImportProductType, setSettingsGalleryImages, setSettingsProductPrice, setSettingsProductAttributes } = importSettingsSlice.actions
export default importSettingsSlice.reducer;