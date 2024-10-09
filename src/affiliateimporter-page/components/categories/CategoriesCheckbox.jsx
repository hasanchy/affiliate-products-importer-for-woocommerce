import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Card, Typography, Tag, Space, Button, Tooltip, Spin, Row, Col } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import { fetchCategories } from '../../services/apiService';
const { Text } = Typography;

const CategoriesCheckbox = ({ value, onChange, disabled, displayError }) => {

	const dispatch = useDispatch();
	const { categories, isLoading } = useSelector((state) => state.categories);

	const [selectedCategories, setSelectedCategories] = useState(value??[]);

	const handleCheckboxChange = (category, e) => {
		let checked = e.target.checked;
		let newSelectedCategories;
		if (checked) {
			newSelectedCategories = [...selectedCategories, {id: category.id, name: category.name}];
		} else {
			newSelectedCategories = selectedCategories.filter(sc => sc.id !== category.id);
		}
		if (onChange) {
			onChange(newSelectedCategories);
		}
		setSelectedCategories(newSelectedCategories);
	}

	const renderSelectedCategoris = () => {
		if (!isLoading) {
			let values = Object.values(selectedCategories);
			if (values.length) {
				let categoriesTxt = values.length > 1 ? 'categories' : 'category';
				let categoriesName = values.map(category => <Tag key={`tag${category.id}`} color='lime'>{category.name}</Tag>);
				return <div style={{ marginTop: '10px' }}><b>Selected {categoriesTxt}</b>: <Space>{categoriesName}</Space></div>
			} else if(displayError!==false) {
				return <div style={{ marginTop: '10px' }}><Text type="danger">Please select at least one category to import products</Text></div>
			}
			return null
		}
		return null;
	}

	const renderProductCategories = (ctg) => {
		let categoryListHTML = [];
		ctg.forEach(category => {
			let children = "";
			if (category.children.length) {
				children = renderProductCategories(category.children)
			}

			let defaultChecked = false;

			for (let i in selectedCategories) {
				if (selectedCategories[i].id === category.id) {
					defaultChecked = true;
				}
			}

			categoryListHTML.push(
				<li key={category.id}>
					<Checkbox onChange={handleCheckboxChange.bind(this,category)} disabled={disabled || isLoading} defaultChecked={defaultChecked}>{category.name}</Checkbox>
					{children}
				</li>
			)
		});
		return <ul>{categoryListHTML}</ul>;
	}

	const reloadCategories = () => {
		dispatch(fetchCategories());
	}

	const renderReloadButton = () => {

		if(isLoading){
			return <Button disabled={true} size='small' type="default" icon={<ReloadOutlined/>} onClick={reloadCategories}></Button>
		}

		return <Tooltip placement="topLeft" title={ __( 'Reload Categories', 'affiliate-products-importer-for-woocommerce' ) } color='purple' key={'reload-categories'}>
			<Button size='small' type="default" icon={<ReloadOutlined/>} onClick={reloadCategories}></Button>
		</Tooltip>
	}

	return (
		<div>
			<Card>
				<div>
					<Row>
						<Col span={12}>
							{isLoading &&
								<Space><Spin tip="" size="medium"> </Spin> <div>Loading categories...</div></Space>
							}
						</Col>
						<Col span={12}>
							<Space style={{width: '100%', justifyContent: 'right'}}>
								<Tooltip placement="topLeft" title={ __( 'Add a New Category', 'affiliate-products-importer-for-woocommerce' ) } color='purple' key={'add-category'}>
									<a href='edit-tags.php?taxonomy=product_cat&post_type=product' target='_blank'><Button size='small' type="default" icon={<PlusOutlined/>}></Button></a>
								</Tooltip>
								{renderReloadButton()}
							</Space>
						</Col>
					</Row>
				</div>
				<div className="affprodimp-product-categories">
					{renderProductCategories(categories)}
				</div>
			</Card>
			{renderSelectedCategoris()}
		</div>
	)
}

export default CategoriesCheckbox;