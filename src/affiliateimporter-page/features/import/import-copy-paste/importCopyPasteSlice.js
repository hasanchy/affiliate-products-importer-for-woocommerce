import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { asinVerification, saveProducts } from '../../../services/apiService';

export const importCopyPasteSlice = createSlice({
	name: 'importCopyPaste',
	initialState: {
		selectedCategories: [],
		isImporting: false,
		asinsTofetch: [],
		totalAsinsFetched: 0,
		totalAsinsImported: 0,
		isImportQueueAdding: false,
		error: null,
		// asinValue: '',
		asinValue: `B0BLN9TMLX
B084MLH376
B0BLN8XX9G
B00NOG2EZQ
B0BLNG2R37
B0C24CTJVH
B1BLN9TMLX`,
        asinValueFetched:'',
		// asinCodes: [],
		asinCodes: ['B0BLN9TMLX', 'B084MLH376', 'B0BLN8XX9G', 'B00NOG2EZQ', 'B0BLNG2R37', 'B0C24CTJVH', 'B1BLN9TMLX'],
		invalidAsinCodes: [],
		duplicateAsinCodes: [],
		awaitingProducts: [],
		importButtonText: 'Import',
		importStatus: '',
		importResponse: [],
		message: '',
		importQueue:[],
		importQueueDuplicate:[],
		importQueueError:[],
		importQueueDeleted:[],
		importType:'copy-paste',
		importStepIndex:1,

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
		// importableFetchItems:[],
		importableFetchItems:[ 'B0BLN9TMLX', 'B084MLH376', 'B0BLN8XX9G', 'B00NOG2EZQ', 'B0BLNG2R37' ],
		importFetchItems:[
            {
                "asin": "B0BLN9TMLX",
                "is_already_imported": false,
                "post_title": "Stupell Industries Sea Birds Abstract Beach 2pc Set Canvas Wall Art, Design by Paul Brent, Gallery Wrapped Canvas, 16 x 20",
                "post_name": "stupell-industries-sea-birds-abstract-beach-2pc-set-canvas-wall-art-design-by-paul-brent-gallery-wrapped-canvas-16-x-20",
                "post_content": "Dimensions: 2 Piece Set, Each Panel is 16 x 1.5 x 20 Inches<\/br>Wall Art is Ready to Hang - No Installation or Hardware Needed. For Easy Set Up Lean or Layer Artwork on Shelf or Against Wall.<\/br>Artwork Relates To: Heron, Ardeidae, Waterfowl, Bird, Animal, Egret, Crane Bird, Pelican, Landscape, Nature<\/br>Our stretched canvas is created with the highest standards. We use only the highest quality inks and canvas on our in house Mimaki printers, and then hand cut and stretch each piece over a 1.5 inch thick wooden frame for hanging. Made In USA.<\/br>Design by Paul Brent",
                "image_primary": "https:\/\/m.media-amazon.com\/images\/I\/410-SIj0KiL._SL500_.jpg",
                "image_variants": [
                    "https:\/\/m.media-amazon.com\/images\/I\/41OB4jeUyJL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/31rT1Koyc+L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41WTlHvCbuL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41aFx+eC64L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41Ug3HQ4N1L._SL500_.jpg"
                ],
                "regular_price": "44.45",
                "price": "44.45",
                "product_url": "https:\/\/www.amazon.com\/dp\/B0BLN9TMLX\/"
            },
            {
                "asin": "B084MLH376",
                "is_already_imported": false,
                "post_title": "Kate and Laurel Sylvie Waves Crashing Framed Canvas Wall Art by Caroline Mint, 23x33 White, Chic Coastal Wall Decor",
                "post_name": "kate-and-laurel-sylvie-waves-crashing-framed-canvas-wall-art-by-caroline-mint-23x33-white-chic-coastal-wall-decor",
                "post_content": "TRANSITIONAL CANVAS WALL ART: Whimsical art on framed high quality gallery-wrapped canvas. Print name: \"Waves Crashing\" by Caroline Mint<\/br>EASY TO HANG: Metal sawtooth hangers come attached on the inset MDF back for easy wall display<\/br>LARGE SIZE CANVAS: The frame is lightweight polystyrene with display dimensions of 23\" x 33\"<\/br>LOCALLY FRAMED: Gallery wrapped canvas is printed with fade resistant inks and framed in Waunakee, Wisconsin, USA of domestic and imported parts<\/br>ARTIST DESIGNED: Print \"Waves Crashing\" 2020 Caroline Mint",
                "image_primary": "https:\/\/m.media-amazon.com\/images\/I\/31PfI5djiBL._SL500_.jpg",
                "image_variants": [
                    "https:\/\/m.media-amazon.com\/images\/I\/31aWOYzv9tL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/31-f33NvRWL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41Q3+CJUGKL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/31cb-0U4pcL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/31zErFkVZAL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41U0uxekqEL._SL500_.jpg"
                ],
                "regular_price": "76.99",
                "price": "76.99",
                "product_url": "https:\/\/www.amazon.com\/dp\/B084MLH376\/"
            },
            {
                "asin": "B0BLN8XX9G",
                "is_already_imported": false,
                "post_title": "Stupell Industries Coastal Pelican Bird Abstract Portrait Framed Wall Art, Design by Paul Brent",
                "post_name": "stupell-industries-coastal-pelican-bird-abstract-portrait-framed-wall-art-design-by-paul-brent",
                "post_content": "Dimensions: 24 x 1.5 x 30 Framed<\/br>Wall Art is Ready to Hang - No Installation or Hardware Needed. For Easy Set Up Lean or Layer Artwork on Shelf or Against Wall.<\/br>Artwork Relates To: Bird, Animal, Waterfowl, Ardeidae, Pelican, Painting<\/br>Our gicl\u00e9e prints are carefully mounted on a durable MDF backing, and then perfectly finished in a 1.5 inch thick woodgrain frame. Mounted frame colors include black, gray farmhouse and white. Made In USA.<\/br>Design by Paul Brent",
                "image_primary": "https:\/\/m.media-amazon.com\/images\/I\/41OHiQZN5BL._SL500_.jpg",
                "image_variants": [
                    "https:\/\/m.media-amazon.com\/images\/I\/51FrYVOIndL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41pSbh0VirL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41cyo7rVSsL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/31z7AYNYjSL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41KVMHeAT6L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41aFx+eC64L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41LF5cjuc1L._SL500_.jpg"
                ],
                "regular_price": "61.05",
                "price": "61.05",
                "product_url": "https:\/\/www.amazon.com\/dp\/B0BLN8XX9G\/"
            },
            {
                "asin": "B00NOG2EZQ",
                "is_already_imported": false,
                "post_title": "Head West Frameless Reeded Aqua Sea Glass Tiled Printed Wall Mirror - 24\" x 30\"",
                "post_name": "head-west-frameless-reeded-aqua-sea-glass-tiled-printed-wall-mirror-24-x-30",
                "post_content": "FRAMELESS - Slender 1\/8\" thick glass reproduces a framed look with a mutli-layered printing technique to create a tile-look border with reeds of glass creating a textured surface.<\/br>TRANQUIL COLOR SCHEME - Hues of turquoise and aqua play off each other to create a translucent depth to the frame creating a serene feel that compliments modern home decor.<\/br>VERTICAL OR HORIZONTAL MOUNT - Our mirrors come with a D-ring hanger on each side, allowing you to choose between vertical or horizontal placement.<\/br>VERSATILE - This mirror provides a wide range of placement and purpose. Hang this mirror in your bedroom or bathroom as a vanity mirror or use it as an accent piece in your living room or hallway.<\/br>THIN AND LIGHTWEIGHT - Weighing slightly over 9 pounds, this piece can be easily installed by a single person. Mirror sits 1\/4\" off the wall when hung.",
                "image_primary": "https:\/\/m.media-amazon.com\/images\/I\/41J+nqXZ6NL._SL500_.jpg",
                "image_variants": [
                    "https:\/\/m.media-amazon.com\/images\/I\/41l6-WZT2YL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41jmK16vtNL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/51CPTqdTv9L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/51SJ9CBtREL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/51B5B8G7YML._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41ArN+4JDOL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41cMNAtTDiL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/51k5aw5pziL._SL500_.jpg"
                ],
                "regular_price": "119.99",
                "sale_price": "104.25",
                "price": "104.25",
                "product_url": "https:\/\/www.amazon.com\/dp\/B00NOG2EZQ\/"
            },
            {
                "asin": "B0BLNG2R37",
                "is_already_imported": false,
                "post_title": "Stupell Industries Lone Sandpiper Bird Portrait Framed Wall Art, Design by Kim Allen",
                "post_name": "stupell-industries-lone-sandpiper-bird-portrait-framed-wall-art-design-by-kim-allen",
                "post_content": "Dimensions: 12 x 1.5 x 12 Framed<\/br>Wall Art is Ready to Hang - No Installation or Hardware Needed. For Easy Set Up Lean or Layer Artwork on Shelf or Against Wall.<\/br>Artwork Relates To: Bird, Animal, Anthus, Beak, Sandpiper<\/br>Our gicl\u00e9e prints are carefully mounted on a durable MDF backing, and then perfectly finished in a 1.5 inch thick woodgrain frame. Mounted frame colors include black, gray farmhouse and white. Made In USA.<\/br>Design by Kim Allen",
                "image_primary": "https:\/\/m.media-amazon.com\/images\/I\/41CxE45xFIL._SL500_.jpg",
                "image_variants": [
                    "https:\/\/m.media-amazon.com\/images\/I\/414bNjSkrUL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41UKui55wsL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41cyo7rVSsL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/31rQUMlqIWL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41KVMHeAT6L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41aFx+eC64L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41R1lDEmY-L._SL500_.jpg"
                ],
                "regular_price": "40.16",
                "price": "40.16",
                "product_url": "https:\/\/www.amazon.com\/dp\/B0BLNG2R37\/"
            },
            {
                "asin": "B0C24CTJVH",
                "is_already_imported": true,
                "post_title": "Stupell Industries Coastal Town Seaport Sailboats Wall Plaque Art, Design by Roy Thompson, 15 x 10",
                "post_name": "stupell-industries-coastal-town-seaport-sailboats-wall-plaque-art-design-by-roy-thompson-15-x-10",
                "post_content": "Wall Plaque Sizes Include Standard: 15 x 0.5 x 10 Oversized: 19 x 0.5 x 13<\/br>Wall Art is Ready to Hang - No Installation or Hardware Needed. For Easy Set Up Lean or Layer Artwork on Shelf or Against Wall.<\/br>All of our wall plaques start off as high quality lithograph prints that are then mounted on durable 0.5 inch thick MDF wood. Each piece is hand finished and comes with a fresh layer of foil on the sides to give it a crisp clean look. Made In USA.<\/br>Artwork Relates To: Town, Road, Street, Urban, Neighborhood, Architecture, Building, Cottage, House, Bicycle, Animal, Dog, Sailboats, Ocean, Sea<\/br>Design by Roy Thompson",
                "image_primary": "https:\/\/m.media-amazon.com\/images\/I\/51k02KOFApL._SL500_.jpg",
                "image_variants": [
                    "https:\/\/m.media-amazon.com\/images\/I\/51V7Bme0QoL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/21YPYxC5SIL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41qw8BZLLkL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/21YPYxC5SIL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41qw8BZLLkL._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41aFx+eC64L._SL500_.jpg",
                    "https:\/\/m.media-amazon.com\/images\/I\/41LF5cjuc1L._SL500_.jpg"
                ],
                "regular_price": "16.12",
                "price": "16.12",
                "product_url": "https:\/\/www.amazon.com\/dp\/B0C24CTJVH\/"
            }
        ],
		// importFetchItems: [],
		// importFetchErrors: [
        //     {
        //         "__type": "com.amazon.paapi5#ErrorData",
        //         "Code": "InvalidParameterValue",
        //         "Message": "The ItemId B1BLN9TMLX provided in the request is invalid."
        //     }
        // ],
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
		setAsinsToFetch: (state, action) => {
			if(state.asinsTofetch.length){
				state.asinsTofetch = [...state.asinsTofetch, ...action.payload];
			}else{
				state.asinsTofetch = action.payload;
			}
		},
		setInvalidAsinCodes: (state, action) => {
			state.invalidAsinCodes = action.payload;
		},
		setDuplicateAsinCodes: (state, action) => {
			state.duplicateAsinCodes = action.payload;
		},
		setAwaitingProducts: (state, action) => {
			state.awaitingProducts = action.payload;
		},
		setImportButtonText: (state, action) => {
			state.importButtonText = action.payload;
		},
		setImportStatus: (state, action) => {
			state.importStatus = action.payload;
		},
		setImportResponse: (state, action) => {
			state.importResponse = action.payload;
		},
		setMessage: (state, action) => {
			state.message = action.payload;
		},
		setIsImporting: (state, action) => {
			state.isImporting = action.payload;
		},
		setImportType: (state, action) => {
			state.importType = action.payload;
		},
		setImportStepIndex: (state, action) => {
			state.importStepIndex = action.payload;
		},
		setImportQueue: (state, action) => {
			state.importQueue = action.payload;
		},
		setImportQueueDeleted: (state, action) => {
			state.importQueueDeleted = action.payload;
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
		setImportFetchAlert: (state, action) => {
			state.importFetchAlert = action.payload
		},
		setImportCancelledFetchItems: (state, action) => {
			state.importCancelledFetchItems = action.payload
		},
		setImportQueuedFetchItems: (state, action) => {
			state.importQueuedFetchItems = action.payload
		},
		setImportSuccessfulFetchItems: (state, action) => {
			state.importSuccessfulFetchItems = action.payload
			console.log(action.payload);
			
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
			state.isImportQueueAdding = true;
		}),
		builder.addCase(saveProducts.fulfilled, (state, action) => {

			state.importSuccessfulFetchItems = [...state.importSuccessfulFetchItems, ...action.payload.product_asins]

			let totalAsinsImported = action.payload.product_ids.length;
			
			if(state.totalAsinsImported){
				state.totalAsinsImported += totalAsinsImported;
			}else{
				state.totalAsinsImported = totalAsinsImported;
			}

			if(state.totalAsinsImported === state.importQueue.length){
				state.isImporting = false;
				state.importQueue = [];
				state.importQueueDuplicate = [];
				state.importQueueError = [];
			}
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
export const { setDuplicateAsinCodes,setSelectedCategories, setAsinValue, setAsinCodes, setInvalidAsinCodes, setAwaitingProducts, setImportButtonText, setImportStatus, setImportResponse, setMessage, setAsinsToFetch, setIsImporting, setImportType, setImportStepIndex, setImportQueue, setImportQueueDeleted, setDisplayImportFetchCounter, setImportFetchItems, setImportFetchErrors, setImportableFetchItems, setImportFetchAlert, setImportCancelledFetchItems, setIsImportInProgress, setImportQueuedFetchItems, setImportSuccessfulFetchItems, setDisplayImportCounter, setDisplayImportSuccessMessage, setImportQueueDeletable, setImportFetchProgress } = importCopyPasteSlice.actions

export default importCopyPasteSlice.reducer