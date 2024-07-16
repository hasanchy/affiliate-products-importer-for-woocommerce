import { createSlice } from '@reduxjs/toolkit';
import { fetchAmazonApiSettings, fetchImportSettings, saveAmazonApiSettings, saveImportSettings, verifyAmazonApiSettings } from '../../../services/apiService';

const initialState = {
	importRemoteAmazonImage: true,
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
	},
	extraReducers: (builder) => {
		builder.addCase(fetchImportSettings.pending, (state) => {
			state.isImportSettingsLoading = true;
		}),
		builder.addCase(fetchImportSettings.fulfilled, (state, action) => {
			state.isImportSettingsLoading = false;
			state.importRemoteAmazonImage = action.payload.remote_image === 'Yes' ? true: false;
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

export const { setSettingsToastMessage, setRemoteAmazonImage } = importSettingsSlice.actions
export default importSettingsSlice.reducer;