import React, {memo} from 'react';
import { Card, Image, Skeleton, Space, Table, Tag, Typography } from 'antd';
import { __ } from '@wordpress/i18n';

const { Text } = Typography;

const ProductList = memo((props) => {

	const renderProductTable = () => {
		const columns = [
			{
				title: __( 'Image', 'affiliate-products-importer-for-woocommerce' ),
				dataIndex: 'image_primary',
				key: 'img',
				render: (imageSrc, productObj) => {
					if(imageSrc){
						if(productObj.image_variants?.length){
							let previewImages = [imageSrc, ...productObj.image_variants]
							return <Image.PreviewGroup
								items={previewImages}
							>
								<Image src={imageSrc} width='125px'/>
							</Image.PreviewGroup>
						}
						return <Image src={imageSrc} alt={productObj.post_title} width='125px'/>
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
				key: 'status',
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
			dataSource={props.data}
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
				{props.data.length > 0 &&
					<Card title={ __( props.title, 'affiliate-products-importer-for-woocommerce' ) } bordered={true}>
						{renderProductTable()}
					</Card>
				}
			</Space>
		</>
	)
})

export default ProductList;