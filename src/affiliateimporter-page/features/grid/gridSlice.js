import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initializePixel = () => {
    let pixels = []
    for(let i = 0; i< 256; i++){
        pixels.push('transparent');
    }
    return pixels;
}

const initialState = {
	pixelData: initializePixel(),
    savedPixelData: [],
    isMouseDown: false,
    colorOptions:[ 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'teal', 'brown', 'gray', 'transparent' ],
    selectedColor: 'red',
    isPixelDataFetching: false,
    isPixelDataSaving: false,
    alert:{
        type: null,
        message: null
    }
}

export const fetchPixelData = createAsyncThunk('settings/fetchPixelData', async (data, {rejectWithValue}) => {
	try{
		const res = await axios.get(affimportrPixelArt.restEndpointSettings, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affimportrPixelArt.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const savePixelData = createAsyncThunk('settings/savePixelData', async (data, {rejectWithValue}) => {
	try{
		const res = await axios.post(affimportrPixelArt.restEndpointSettings, data, {
			headers: {
				'content-type': 'application/json',
				'X-WP-NONCE': affimportrPixelArt.restNonce
			}
		});
		return res.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const gridSlice = createSlice({
	name: 'grid',
	initialState,
	reducers: {
        setPixels: (state, action) => {
			state.pixelData = action.payload;
		},
        resetPixels: (state, action) => {
			state.pixelData = initializePixel();
		},
        setIsMouseDown: (state, action) => {
			state.isMouseDown = action.payload;
		},
        setSelectedColor: (state, action) => {
			state.selectedColor = action.payload;
		}
	},
	extraReducers: (builder) => {
        builder.addCase(fetchPixelData.pending, (state) => {
			state.isPixelDataFetching = true;
		}),
		builder.addCase(fetchPixelData.fulfilled, (state, action) => {
			state.isPixelDataFetching = false;
            if(action.payload.affimportr_pixel_data){
                state.pixelData = action.payload.affimportr_pixel_data
                state.savedPixelData = action.payload.affimportr_pixel_data
            }
		}),
		builder.addCase(fetchPixelData.rejected, (state, action) => {
			state.isPixelDataFetching = false;
			let errorMessage = (action.payload?.message) ? action.payload.message : 'Fetching pixel data failed.';
            state.alert = {
                type: 'error',
                message: errorMessage
            };
        }),
        builder.addCase(savePixelData.pending, (state) => {
			state.isPixelDataSaving = true;
            state.alert = {
                type: null,
                message: null
            };
		}),
		builder.addCase(savePixelData.fulfilled, (state, action) => {
			state.isPixelDataSaving = false
            state.savedPixelData = state.pixelData
            state.alert = {
                type: 'success',
                message: 'Pixel data has been saved successfully!'
            };
		}),
		builder.addCase(savePixelData.rejected, (state, action) => {
			state.isPixelDataSaving = false;
			let errorMessage = (action.payload?.message) ? action.payload.message : 'Saving pixel data failed';
            state.alert = {
                type: 'error',
                message: errorMessage
            };
        })
	}
})

export const { setPixels, resetPixels, setIsMouseDown, setSelectedColor } = gridSlice.actions
export default gridSlice.reducer;