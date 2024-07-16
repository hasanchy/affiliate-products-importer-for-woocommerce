import React from 'react';
import { Tabs, Card } from 'antd';
import { DownloadOutlined, AmazonOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsActiveTab } from './settingsSlice';
import AmazonApiSettings from './amazon-api-settings/AmazonApiSettings';
import ImportSettings from './import-settings/ImportSettings';


const Settings = () => {

	const dispatch = useDispatch();
	const { settingsActiveTab } = useSelector((state) => state.settings);

	const settingsTabItems = [
		{
			key: 'amazonApiSettings',
			label: 'Amazon API Settings',
			children: <AmazonApiSettings />,
			icon: <AmazonOutlined/>
		},
		{
			key: 'importSettings',
			label: 'Import Settings',
			children: <ImportSettings />,
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