import React, {memo} from 'react';
import { Card, Image, Spin, Typography  } from 'antd';
import { useSelector } from 'react-redux';
const { Link } = Typography;
import { __ } from '@wordpress/i18n';

const RecentlyImportedProducts = memo(() => {

	const { productList, isProductsLoading} = useSelector((state) => state.dashboard);

	const decodeString = ( rawString ) => {
		const parser = new DOMParser();
  		const decodedString = parser.parseFromString(rawString, 'text/html').body.textContent;
		return decodedString;
	}

	const renderProductGallery = () => {
		let gallery = [];

		for(let i in productList){
			gallery.push(<div className='affprodimp-image-gallery'>
				<Link href={productList[i].product_url} target="_blank">
					<Card>
						<Image preview={false} src={productList[i].image_primary} alt={productList[i].product_title} width='115px'/>
						<div style={{width:'115px'}}>
							{decodeString(productList[i].product_title.substring(0, 55))}...
						</div>
					</Card>
				</Link>
			</div>);
		}

		return gallery;
	}
	  
    return (
		<>
			<Card title={ __( 'Recently Imported Products', 'affiliate-products-importer' ) } bordered={true}>
				{isProductsLoading && <Spin tip="" size="medium"> </Spin>}
				{renderProductGallery()}
			</Card>
		</>
	)
})

export default RecentlyImportedProducts;