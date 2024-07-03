import { Provider } from 'react-redux'
import App from "./app/App";
import store from './store/store';
import './assets/styles/main.scss';

const domElement = document.getElementById( window.affimportrAffiliateImporter.dom_element_id );

if(domElement){
	const root = ReactDOM.createRoot(domElement)

	root.render(
		<Provider store={store}>
			<App />
		</Provider>
	)
}