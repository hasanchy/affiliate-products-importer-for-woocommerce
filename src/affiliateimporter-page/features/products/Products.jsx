import React from 'react';
import { useSelector } from 'react-redux';
import ProductTable from './product-table/ProductTable';
import ProductAdd from './product-add/ProductAdd';

const Products = () => {

	const { productsScreen } = useSelector((state) => state.products);
    
	return (
		<>
			{productsScreen === 'add-new-product' &&
				<ProductAdd />
			}
			{productsScreen === 'default' &&
				<ProductTable />
			}
		</>
	)
}

export default Products;