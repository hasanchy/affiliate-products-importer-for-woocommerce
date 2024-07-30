import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	activeTab: 'dashboard',
}

export const menuTabsSlice = createSlice({
	name: 'menuTabs',
	initialState,
	reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        }
	}
})

export const { setActiveTab } = menuTabsSlice.actions
export default menuTabsSlice.reducer;