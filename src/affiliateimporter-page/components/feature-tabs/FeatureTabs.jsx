import React, { useState } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { DashboardOutlined, DownloadOutlined, ShoppingOutlined, SettingOutlined } from '@ant-design/icons';
import Dashboard from '../../features/dashboard/Dashboard';
import Import from '../../features/import/Import';
import Products from '../../features/products/Products';

const FeatureTabs = () => {

	const [activeTab, setActiveTab] = useState('import')

	const tabItems = [
		{
			key: 'dashboard',
			label: 'Dashboard',
			children: <Dashboard />,
			icon: <DashboardOutlined />
		},
		{
			key: 'import',
			label: 'Import',
			children: <Import/>,
			icon: <DownloadOutlined />
		},
		{
			key: 'products',
			label: 'Products',
			children: <Products/>,
			icon: <ShoppingOutlined />
		},
		{
			key: 'settings',
			label: 'Settings',
			children: 'Settings goes here...',
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
						colorPrimary: '#672fb4'
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