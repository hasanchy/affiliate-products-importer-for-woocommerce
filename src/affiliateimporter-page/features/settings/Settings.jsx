import React from 'react';
import { Tabs, Card } from 'antd';
import { DownloadOutlined, AmazonOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsActiveTab } from './settingsSlice';
import AmazonAPISettings from './AmazonAPISettings';
// import { setSettingsActiveTab, setAmazonAccessKey, setAmazonSecretKey, setAmazonCountryCode, setAmazonAffiliateId, saveSettings } from './settingsSlice';
// import AmazonAPISettings from './AmazonAPISettings';
// import ImportSettings from './ImportSettings';
// import ProductSyncSettings from './ProductSyncSettings';


const Settings = () => {

	const dispatch = useDispatch();
	const { settingsActiveTab } = useSelector((state) => state.settings);

	const settingsTabItems = [
		{
			key: 'amazonApiSettings',
			label: 'Amazon API Settings',
			children: <AmazonAPISettings />,
			icon: <AmazonOutlined/>
		},
		{
			key: 'importSettings',
			label: 'Import Settings',
			children: 'Import settings goes here...',
			icon: <DownloadOutlined/>
		}
	];

	const handleSettingsTabChange = (tabKey) => {
		dispatch(setSettingsActiveTab(tabKey));
	}

	return <>
		<Card>
			<Tabs activeKey={settingsActiveTab} onChange={handleSettingsTabChange} items={settingsTabItems} tabPosition='left'/>
		</Card>
	</>
}

export default Settings;