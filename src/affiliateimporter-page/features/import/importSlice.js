import { createSlice } from '@reduxjs/toolkit';

export const importSlice = createSlice({
	name: 'import',
	initialState: {
		importType: 'copy-paste', //copy-paste, search-keyword
		importStepIndex: 0
	},
	reducers: {
		setImportType: (state, action) => {
			state.importType = action.payload;
		},
		setImportStepNext: (state, action) => {
			state.importStepIndex += 1;
		},
		setImportStepBack: (state, action) => {
			state.importStepIndex -= 1;
		},
		setImportStepIndex: (state, action) => {
			state.importStepIndex = action.payload;
		},
	},
	extraReducers: (builder) => {
		
	}
})

// Action creators are generated for each case reducer function
export const {setImportType, setImportStepNext, setImportStepBack, setImportStepIndex} = importSlice.actions

export default importSlice.reducer