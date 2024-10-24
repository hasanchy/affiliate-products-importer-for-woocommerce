import { createSlice } from '@reduxjs/toolkit';
import { asinVerification } from '../../../services/apiService';
import { __ } from '@wordpress/i18n';

const initialState = {
	asinValue: '',
	asinValueFetched: '',
	asinCodes: [],
	invalidAsinCodes: [],
	duplicateAsinCodes: [],
	displayImportFetchCounter: false,
	isImportFetchInProgress: false,
	importFetchAlert: {type:'',message:''},
	selectedCategories: [],
	importableItems:[],
	deletedAsins:[],
	importFetchItems: [],
	importFetchErrors: [],
};

export const importCopyPasteSlice = createSlice({
	name: 'importCopyPaste',
	initialState,
	reducers: {
		setSelectedCategories: (state, action) => {
			state.selectedCategories = action.payload;
		},
		setAsinValue: (state, action) => {
			state.asinValue = action.payload;
		},
		setAsinCodes: (state, action) => {
			state.asinCodes = action.payload;
		},
		setInvalidAsinCodes: (state, action) => {
			state.invalidAsinCodes = action.payload;
		},
		setDuplicateAsinCodes: (state, action) => {
			state.duplicateAsinCodes = action.payload;
		},
		setDisplayImportFetchCounter: (state, action) => {
			state.displayImportFetchCounter = action.payload
		},
		setImportFetchProgress: (state, action) => {
			state.importFetchProgress = action.payload
		},
		setImportFetchItems: (state, action) => {
			state.importFetchItems = action.payload;
		},
		setImportFetchErrors: (state, action) => {
			state.importFetchErrors = action.payload;
		},
		setImportableItems: (state, action) => {
			state.importableItems = action.payload;
		},
		setDeletedAsins: (state, action) => {
			state.deletedAsins = action.payload;
		},
		resetState: () => initialState
	},
	extraReducers: (builder) => {
		builder
			.addCase(asinVerification.pending, (state) => {
				state.isImportFetchInProgress = true;
				state.importFetchAlert = {};
			})
			.addCase(asinVerification.fulfilled, (state, action) => {
				state.isImportFetchInProgress = false;
				if(action.payload?.fetch_result){
					let newImportableItems = action.payload.fetch_result.filter(item => !item.is_already_imported);
					state.importFetchItems = [ ...state.importFetchItems, ...action.payload.fetch_result];
					state.importFetchErrors = [ ...state.importFetchErrors, ...action.payload.fetch_errors];
					state.importableItems = [ ...state.importableItems, ...newImportableItems];
				} else if(action.payload?.message){
					state.importFetchAlert = { type: 'warning', message: __(action.payload.message, 'affiliate-products-importer-for-woocommerce') };
				} else {
					state.importFetchAlert = { type: 'warning', message: __('No results found or unexpected response format', 'affiliate-products-importer-for-woocommerce') };
				}
				state.asinValueFetched = state.asinValue;
			})
			.addCase(asinVerification.rejected, (state, action) => {
				state.isImportFetchInProgress = false;
				state.importFetchAlert = {
					type: 'error',
					message: action.payload?.message ? __(action.payload.message, 'affiliate-products-importer-for-woocommerce') : action.error?.message ? __(action.error.message, 'affiliate-products-importer-for-woocommerce') : __('An unknown error occurred', 'affiliate-products-importer-for-woocommerce')
				};
			});
	}
})

// Action creators are generated for each case reducer function
export const { setSelectedCategories, setAsinValue, setAsinCodes, setInvalidAsinCodes, setDuplicateAsinCodes, setDisplayImportFetchCounter, setImportFetchProgress, setImportFetchItems, setImportFetchErrors, setImportableItems, setDeletedAsins, resetState } = importCopyPasteSlice.actions

export default importCopyPasteSlice.reducer
