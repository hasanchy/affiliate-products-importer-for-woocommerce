import React, {memo} from 'react';
import { Card, Image, Typography  } from 'antd';
import { useSelector } from 'react-redux';
const { Link } = Typography;

const RecentlyImportedProducts = memo(() => {

	const { productList} = useSelector((state) => state.products);

	const renderProductGallery = () => {
		let gallery = [];

		for(let i in productList){
			gallery.push(<div className='azoncom-image-gallery'>
				<Image src={productList[i].image_src} alt={productList[i].product_title} width='115px'/>
				<div style={{width:'115px'}}>
					<Link href="https://ant.design" target="_blank">
						{productList[i].product_title.substring(0, 55)}...
					</Link>
				</div>
			</div>);
		}

		return gallery;
	}
	  
    return (
		<>
			<Card title="Recently Imported Products" bordered={true}>
				{renderProductGallery()}
			</Card>
		</>
	)
})

export default RecentlyImportedProducts;