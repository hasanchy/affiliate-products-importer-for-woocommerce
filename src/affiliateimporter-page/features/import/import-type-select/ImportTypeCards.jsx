import React, {useEffect, useState} from 'react';
import { Card, Typography, Row, Col, Flex } from 'antd';
const {Title} = Typography;
import { CheckCircleFilled, CopyOutlined, FileExcelOutlined, FileSearchOutlined, FileAddOutlined } from '@ant-design/icons';

const ImportTypeCard = (props) => {
    let iconColor = props.selected ? 'rgba(0,0,0, 0.75)' : 'rgba(0, 0, 0, 0.55)';
    let boxShadow = props.selected ? '0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)' : '';
    return (
        <div onClick={props.onClick}>
            <Card
                style={{
                    width: '250px',
                    height: '250px',
                    boxShadow: boxShadow
                }}
                hoverable
            >
                <Row>
                    <Col span={24} style={{display: 'flex', height:'25px', marginBottom:'20px', justifyContent: 'right'}}>
                        {props.selected && <CheckCircleFilled style={{fontSize:'25px', color: 'rgba(0,0,0, 0.75)'}}/>}
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{display: 'flex', justifyContent: 'center'}}>
                        <span style={{fontSize:'70px', color:iconColor}}>{props.icon}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{display: 'flex', justifyContent: 'center'}}>
                        <Title level={5} style={{color: iconColor}}>{props.label}</Title>
                    </Col>
                </Row>
                
            </Card>
        </div>
    )
}

const ImportTypeCards = (props) => {
    const [selectedCard, setSelectedCard] = useState('');
    useEffect(()=>{
        if(props.defaultSelectedKey){
            setSelectedCard(props.defaultSelectedKey);
        }
    },[]);
    
    const handleCardSelect = (key) => {
        props.onClick(key);
        setSelectedCard(key);
    }

    const renderCards = () => {
        let items = props.items ?? [];
        
        let cards = [];
        for(let i in items){
            let isSelected = selectedCard === items[i].key;
            cards.push(
                <ImportTypeCard key={items[i].key} type={items[i].key} selected={isSelected} label={items[i].label} icon={items[i].icon} onClick={handleCardSelect.bind(this, items[i].key)}/>
            );
        }

        return cards;
    }

    return (
        <Flex wrap="wrap" gap={100} justify='center'>
            {renderCards()}
        </Flex>
    )
}

export default ImportTypeCards;