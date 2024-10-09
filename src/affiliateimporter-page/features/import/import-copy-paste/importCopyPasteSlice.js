import { createSlice } from '@reduxjs/toolkit';
import { asinVerification } from '../../../services/apiService';

const initialState = {
	asinValue: '',
	asinValueFetched:'',
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
		builder.addCase(asinVerification.pending, (state) => {
			state.isImportFetchInProgress = true;
			state.importFetchAlert = {};
		}),
		builder.addCase(asinVerification.fulfilled, (state, action) => {
			state.isImportFetchInProgress = false;
			if(action.payload?.fetch_result){
				
				let newImportableItems = []
				for(let i in action.payload.fetch_result){
					if(!action.payload.fetch_result[i].is_already_imported){
						newImportableItems.push(action.payload.fetch_result[i]);
					}
				}

				state.importFetchItems = [ ...state.importFetchItems, ...action.payload.fetch_result];
				state.importFetchErrors = [ ...state.importFetchErrors, ...action.payload.fetch_errors];
				state.importableItems = [ ...state.importableItems, ...newImportableItems];
			}else if(action.payload?.message){
				state.importFetchAlert = {type:'warning', message: action.payload.message}
            }
            state.asinValueFetched = state.asinValue
		}),
		builder.addCase(asinVerification.rejected, (state, action) => {
			state.isImportFetchInProgress = false;
			state.importFetchAlert = {type:'error', message: action.payload.message}
		})
	}
})

// Action creators are generated for each case reducer function
export const {setSelectedCategories, setAsinValue, setAsinCodes, setInvalidAsinCodes, setDuplicateAsinCodes, setDisplayImportFetchCounter, setImportFetchProgress, setImportFetchItems, setImportFetchErrors, setImportableItems, setDeletedAsins, resetState } = importCopyPasteSlice.actions

export default importCopyPasteSlice.reducer