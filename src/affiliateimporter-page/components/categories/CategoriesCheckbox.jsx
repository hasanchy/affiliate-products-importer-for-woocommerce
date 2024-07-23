import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Card, Typography, Tag, Space } from 'antd';
const { Text } = Typography;

const CategoriesCheckbox = ({ value, onChange, disabled, displayError }) => {

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
				let categoriesName = values.map(category => <Tag color='lime'>{category.name}</Tag>);
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
					<Checkbox onChange={handleCheckboxChange.bind(this,category)} disabled={disabled} defaultChecked={defaultChecked}>{category.name}</Checkbox>
					{children}
				</li>
			)
		});
		return <ul>{categoryListHTML}</ul>;
	}

	return (
		<div>
			<Card>
				<div className="affprodimp-product-categories">
					{isLoading ? (
						<div>Loading categories...</div>
					) : (
						renderProductCategories(categories)
					)}
				</div>
			</Card>
			{renderSelectedCategoris()}
		</div>
	)
}

export default CategoriesCheckbox;