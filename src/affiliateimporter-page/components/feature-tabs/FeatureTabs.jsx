import React, { useState } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { DashboardOutlined, DownloadOutlined, ShoppingOutlined, SettingOutlined } from '@ant-design/icons';
import Dashboard from '../../features/dashboard/Dashboard';
import Import from '../../features/import/Import';
import Products from '../../features/products/Products';
import Settings from '../../features/settings/Settings';
import { __ } from '@wordpress/i18n';

const FeatureTabs = () => {

	const [activeTab, setActiveTab] = useState('dashboard')

	const tabItems = [
		{
			key: 'dashboard',
			label: __( 'Dashboard', 'affiliate-products-importer' ),
			children: <Dashboard />,
			icon: <DashboardOutlined />
		},
		{
			key: 'import',
			label: __( 'Import', 'affiliate-products-importer' ),
			children: <Import/>,
			icon: <DownloadOutlined />
		},
		{
			key: 'products',
			label: __( 'Products', 'affiliate-products-importer' ),
			children: <Products/>,
			icon: <ShoppingOutlined />
		},
		{
			key: 'settings',
			label: __( 'Settings', 'affiliate-products-importer' ),
			children: <Settings/>,
			icon: <SettingOutlined />
		}
	];

	const handleOnChange = (activeKey) => {
		setActiveTab(activeKey);
	}

	return (
		<React.Fragment>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#672fb4',
						margin:"0"
					},
				}}
			>
				<Tabs
					activeKey={activeTab}
					type="card"
					size="large"
					items={tabItems}
					onChange={handleOnChange}
				/>
			</ConfigProvider>
		</React.Fragment>
	)
}

export default FeatureTabs