import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { asinVerification, saveProducts } from '../../../services/apiService';

export const importCopyPasteSlice = createSlice({
	name: 'importCopyPaste',
	initialState: {
		selectedCategories: [],
		error: null,
		asinValue: '',
        asinValueFetched:'',
		asinCodes: [],
		invalidAsinCodes: [],
		duplicateAsinCodes: [],
		
		importQueueDuplicate:[],
		importQueueError:[],

		isImportFetchInProgress: false,
		displayImportFetchCounter: false,
		displayImportCounter: false,
		importFetchProgress: 0,
		displayImportCounter: false,
		isImportInProgress: false,
		isImportQueueDeletable: false,
		importFetchAlert: {type:'',message:''},
		importCancelledFetchItems:[],
		importQueuedFetchItems:[],
		importSuccessfulFetchItems:[],
		displayImportSuccessMessage: false,
		importableFetchItems:[],
		importFetchItems: [],
		importFetchErrors: [],
	},
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
		setImportType: (state, action) => {
			state.importType = action.payload;
		},
		setImportQueue: (state, action) => {
			state.importQueue = action.payload;
		},
		setDisplayImportFetchCounter: (state, action) => {
			state.displayImportFetchCounter = action.payload
		},
		setImportFetchProgress: (state, action) => {
			state.importFetchProgress = action.payload
		},
		setDisplayImportCounter: (state, action) => {
			state.displayImportCounter = action.payload
		},
		setImportFetchItems: (state, action) => {
			state.importFetchItems = action.payload;
		},
		setImportFetchErrors: (state, action) => {
			state.importFetchErrors = action.payload;
		},
		setImportableFetchItems: (state, action) => {
			state.importableFetchItems = action.payload;
		},
		setImportCancelledFetchItems: (state, action) => {
			state.importCancelledFetchItems = action.payload
		},
		setImportQueuedFetchItems: (state, action) => {
			state.importQueuedFetchItems = action.payload
		},
		setImportSuccessfulFetchItems: (state, action) => {
			state.importSuccessfulFetchItems = action.payload
		},
		setIsImportInProgress: (state, action) => {
			state.isImportInProgress = action.payload
		},
		setDisplayImportSuccessMessage: (state, action) => {
			state.displayImportSuccessMessage = action.payload
		},
		setImportQueueDeletable: (state, action) => {
			state.isImportQueueDeletable = action.payload
		}
	},
	extraReducers: (builder) => {
		builder.addCase(saveProducts.pending, (state) => {
		}),
		builder.addCase(saveProducts.fulfilled, (state, action) => {
			state.importSuccessfulFetchItems = [...state.importSuccessfulFetchItems, ...action.payload.product_asins]
		}),
		builder.addCase(saveProducts.rejected, (state, action) => {
			state.error = action.error.message;
		}),
		builder.addCase(asinVerification.pending, (state) => {
			state.isImportFetchInProgress = true;
			state.importFetchAlert = {};
		}),
		builder.addCase(asinVerification.fulfilled, (state, action) => {
			state.isImportFetchInProgress = false;
			if(action.payload?.fetch_result){
				
				let importableFetchItems = []
				for(let i in action.payload.fetch_result){
					if(!action.payload.fetch_result[i].is_already_imported){
						importableFetchItems.push(action.payload.fetch_result[i].asin);
					}
				}

				state.importFetchItems = [ ...state.importFetchItems, ...action.payload.fetch_result];
				state.importFetchErrors = [ ...state.importFetchErrors, ...action.payload.fetch_errors];
				state.importableFetchItems = [ ...state.importableFetchItems, ...importableFetchItems];
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
export const { setDuplicateAsinCodes, setSelectedCategories, setAsinValue, setAsinCodes, setInvalidAsinCodes, setImportType, setImportQueue, setDisplayImportFetchCounter, setImportFetchItems, setImportFetchErrors, setImportableFetchItems, setImportCancelledFetchItems, setIsImportInProgress, setImportQueuedFetchItems, setImportSuccessfulFetchItems, setDisplayImportCounter, setDisplayImportSuccessMessage, setImportQueueDeletable, setImportFetchProgress } = importCopyPasteSlice.actions

export default importCopyPasteSlice.reducer