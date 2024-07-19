import React from 'react';
import { Card, Flex, Progress } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const ImportFetchCounter = ({title}) => {

    const { importFetchProgress } = useSelector((state) => state.importCopyPaste);

	let cardTitle = <><SyncOutlined spin={true}/> {title}</>
	return (
		<div style={{ width:'40%', fontSize: '16px', color: '#531dab', cursor: 'pointer', position: 'fixed', padding: '0px', bottom: '0', right: '0px', zIndex: '999', backgroundColor: '#f9f0ff', borderTop: '2px solid #d3adf7', borderLeft: '2px solid #d3adf7', borderRight: '2px solid #d3adf7', borderRadius: '10px 10px 0 0' }}>
			<Card title={cardTitle} size='small'>
				<Flex gap="small" wrap="wrap">
					<span style={{flex: 1}}>
						<Progress
							percent={importFetchProgress}
							status="active"
							strokeColor={{
								from: '#531dab',
								to: '#531dab',
							}}
							showInfo={true} 
						/>
					</span>
				</Flex>
			</Card>
		</div>
	);
};

export default ImportFetchCounter;