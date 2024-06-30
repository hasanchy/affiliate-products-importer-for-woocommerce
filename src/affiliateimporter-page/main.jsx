import React from "react";
import ReactDOM from 'react-dom';
import './scss/style.scss';
import { Provider } from 'react-redux'
import App from './features/app/App';
import store from './store/store';

const domElement = document.getElementById( window.affimportrPixelArt.dom_element_id );

if(domElement){
	const root = ReactDOM.createRoot(domElement)

	root.render(
		<Provider store={store}>
			<App />
		</Provider>
	)
}