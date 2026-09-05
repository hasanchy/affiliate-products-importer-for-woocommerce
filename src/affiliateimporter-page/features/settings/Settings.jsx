import React from 'react';
import { Tabs, Card } from 'antd';
import { DownloadOutlined, AmazonOutlined, SwapOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSettingsActiveTab } from './settingsSlice';
import AmazonApiSettings from './amazon-api-settings/AmazonApiSettings';
import ImportSettings from './import-settings/ImportSettings';
import MigrationSettings from './migration-settings/MigrationSettings';
import { __ } from '@wordpress/i18n';


const Settings = () => {

	const dispatch = useDispatch();
	const { settingsActiveTab } = useSelector((state) => state.settings);

	const settingsTabItems = [
		{
			key: 'amazonApiSettings',
			label: __( 'Amazon API Settings', 'affiliate-products-importer-for-woocommerce' ),
			children: <AmazonApiSettings />,
			icon: <AmazonOutlined/>
		},
		{
			key: 'importSettings',
			label: __( 'Import Settings', 'affiliate-products-importer-for-woocommerce' ),
			children: <ImportSettings />,
			icon: <DownloadOutlined/>
		},
		{
			key: 'migrationSettings',
			label: __( 'WZone Migration', 'affiliate-products-importer-for-woocommerce' ),
			children: <MigrationSettings />,
			icon: <SwapOutlined/>
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