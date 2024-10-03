import React, {memo} from 'react';
import { Card, Image, Skeleton, Space, Table, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { __ } from '@wordpress/i18n';

const { Text } = Typography;

const ImportFetchResult = memo(() => {

	const { importFetchItems, importFetchErrors } = useSelector((state) => state.importCopyPaste);

	let dataSource = [...importFetchItems, ...importFetchErrors]

	const renderProductTable = () => {
		const columns = [
			{
				title: __( 'Image', 'affiliate-products-importer-for-woocommerce' ),
				dataIndex: 'image_primary',
				key: 'img',
				render: (imageSrc, productObj) => {
					if(imageSrc){
						return <Image src={imageSrc} alt={productObj.post_title} height='50px'/>
					}else{
						return <Skeleton.Image  style={{ width: 50, height: 50 }}/>
					}
				},
			},
			{
				title: __( 'Title', 'affiliate-products-importer-for-woocommerce' ),
				dataIndex: 'post_title',
				key: 'title',
				render: (title, productObj) => {
					if(productObj.Message){
						return <Text type="danger">{productObj.Message}</Text>
					}else{
						return <a href={productObj.product_url} target='_blank'>{title}</a>
					}
				}
			},
			{
				title: __( 'Status', 'affiliate-products-importer-for-woocommerce' ),
				dataIndex: 'is_already_imported',
				key: 'title',
				render: (isAlreadyImported, productObj) => {

					let ribbonText = isAlreadyImported ? 'Previously Imported' : 'Importable';
					let ribbonColor = isAlreadyImported ? 'orange' : 'blue';
					if(productObj.Code){
						ribbonText = __( 'Invalid ASIN', 'affiliate-products-importer-for-woocommerce' );
						ribbonColor = 'red';
					}

					return <Tag color={ribbonColor}>
						{ribbonText}
					</Tag>
				}
			}
		]
		
		return <Table
			loading={false}
			dataSource={dataSource}
			columns={columns}
			size="middle"
			pagination={false}
		/>
	}
	  
    return (
		<>
			<Space size='large' direction='vertical' style={{
                    display: 'flex',
                }}>
				{importFetchItems.length > 0 &&
					<Card title={ __( 'ASIN Verification Result', 'affiliate-products-importer-for-woocommerce' ) } bordered={true}>
						{renderProductTable()}
					</Card>
				}
			</Space>
		</>
	)
})

export default ImportFetchResult;