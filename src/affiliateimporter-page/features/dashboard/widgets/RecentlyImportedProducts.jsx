import React, {memo} from 'react';
import { Card, Image, Spin, Typography  } from 'antd';
import { useSelector } from 'react-redux';
const { Link } = Typography;

const RecentlyImportedProducts = memo(() => {

	const { productList, isProductsLoading} = useSelector((state) => state.products);

	const renderProductGallery = () => {
		let gallery = [];

		for(let i in productList){
			gallery.push(<div className='azoncom-image-gallery'>
				<Link href={productList[i].product_url} target="_blank">
					<Card>
						<Image preview={false} src={productList[i].image_primary} alt={productList[i].product_title} width='115px'/>
						<div style={{width:'115px'}}>
							{productList[i].product_title.substring(0, 55)}...
						</div>
					</Card>
				</Link>
			</div>);
		}

		return gallery;
	}
	  
    return (
		<>
			<Card title="Recently Imported Products" bordered={true}>
				{isProductsLoading && <Spin tip="" size="medium"> </Spin>}
				{renderProductGallery()}
			</Card>
		</>
	)
})

export default RecentlyImportedProducts;