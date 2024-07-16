import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    settingsActiveTab: 'amazonApiSettings',
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettingsActiveTab: (state, action) => {
			state.settingsActiveTab = action.payload;
		}
	},
	extraReducers: (builder) => {}
})

export const { setSettingsActiveTab } = settingsSlice.actions
export default settingsSlice.reducer;