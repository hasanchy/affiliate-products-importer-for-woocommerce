import React from 'react';
import { Flex } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const NumberCounter = ( {title, number, spin} ) => {
    return (
        <div style={{ width:'260px', fontSize: '16px', color: '#531dab', cursor: 'pointer', position: 'fixed', padding: '10px', bottom: '0', right: '0px', zIndex: '999', backgroundColor: '#f9f0ff', borderTop: '2px solid #d3adf7', borderLeft: '2px solid #d3adf7', borderRadius: '10px 0 0 0' }}>
            <Flex gap="small" wrap="wrap">
                <span><SyncOutlined spin={spin}/> {title}: <span style={{fontSize:'24px', fontWeight: 'bold'}}>{number}</span></span>
            </Flex>
        </div>
    );
}

export default NumberCounter;