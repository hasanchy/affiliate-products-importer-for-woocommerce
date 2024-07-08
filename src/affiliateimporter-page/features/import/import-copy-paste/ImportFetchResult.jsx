import React, {memo} from 'react';
import { Alert, Card, Image, List, Skeleton, Space, Table, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const ImportFetchResult = memo(() => {

	const { importableFetchItems, importFetchItems, importSuccessfulFetchItems, importFetchErrors } = useSelector((state) => state.importCopyPaste);

	let dataSource = [...importFetchItems, ...importFetchErrors]

	const renderProductTable = () => {
		const columns = [
			{
				title: 'Image',
				dataIndex: 'image_primary',
				key: 'img',
				render: (imageSrc, productObj) => {
					if(imageSrc){
						let previewImages = [imageSrc, ...productObj.image_variants]
						return <Image.PreviewGroup items={previewImages} >
							<Image src={imageSrc} alt={productObj.post_title} height='50px'/>
						</Image.PreviewGroup>
					}else{
						return <Skeleton.Image  style={{ width: 50, height: 50 }}/>
					}
				},
			},
			{
				title: 'Title',
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
				title: 'Status',
				dataIndex: 'is_already_imported',
				key: 'title',
				render: (isAlreadyImported, productObj) => {

					let ribbonText = isAlreadyImported ? 'Previously Imported' : 'Importable';
					// let ribbonColor = isAlreadyImported ? '#faad14' : '#4096ff';
					let ribbonColor = isAlreadyImported ? 'orange' : 'blue';
					if(importSuccessfulFetchItems.includes(productObj.asin)){
						ribbonText = 'Recently Imported';
						// ribbonColor = '#52c41a';
						ribbonColor = 'green';
					}
					if(productObj.Code){
						ribbonText = 'Invalid ASIN';
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

	const renderErrorList = () => {
		let errorList = [];

		importFetchErrors.forEach( (errorObj, i) => {
			errorList.push(<Text type="danger">{errorObj.Message}</Text>)
		})

		return errorList;
	}
	  
    return (
		<>
			<Space size='large' direction='vertical' style={{
                    display: 'flex',
                }}>
				{importFetchItems.length > 0 &&
					<Card title={`ASIN Verification Result`} bordered={true}>
						{renderProductTable()}
					</Card>
				}
				{/* {importFetchErrors.length > 0 &&
					<Card title={`Import Fetch Errors: ${importFetchErrors.length}`} bordered={true}>
						<Space size='middle' direction='vertical'>
							{renderErrorList()}
						</Space>
					</Card>
				} */}
			</Space>
		</>
	)
})

export default ImportFetchResult;