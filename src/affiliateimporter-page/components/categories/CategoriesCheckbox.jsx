import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Card, Typography, Tag, Space, Button, Tooltip, Spin, Row, Col, Input, Tree } from 'antd';
import { ReloadOutlined, PlusOutlined, SearchOutlined, CloseOutlined, CloseCircleFilled } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import { fetchCategories } from '../../services/apiService';
import AddCategoryPopup from './AddCategoryPopup';
const { Text } = Typography;

const CategoriesCheckbox = ({ value, onChange, disabled, displayError }) => {
	const dispatch = useDispatch();
	const { categories, isLoading } = useSelector((state) => state.categories);

	const [selectedCategories, setSelectedCategories] = useState(value ?? []);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);

	const handleCheckboxChange = (category, e) => {
		let checked = e.target.checked;
		let newSelectedCategories;
		if (checked) {
			newSelectedCategories = [...selectedCategories, { id: category.term_id, name: category.name }];
		} else {
			newSelectedCategories = selectedCategories.filter(sc => sc.id !== category.term_id);
		}
		if (onChange) {
			onChange(newSelectedCategories);
		}
		setSelectedCategories(newSelectedCategories);
	};

	const handleSearch = (e) => {
		const value = typeof e === 'object' ? e.target.value : '';
		setSearchKeyword(value);
	};

	const buildCategoryTree = (categories) => {
		const categoryMap = {};
		categories.forEach(category => {
			categoryMap[category.term_id] = { ...category, children: [] };
		});

		const rootCategories = [];
		categories.forEach(category => {
			if (category.parent === 0) {
				rootCategories.push(categoryMap[category.term_id]);
			} else {
				const parent = categoryMap[category.parent];
				if (parent) {
					parent.children.push(categoryMap[category.term_id]);
				}
			}
		});

		return rootCategories;
	};

	const filterCategories = (categories, keyword) => {
		return categories.filter(category => {
			const matchesKeyword = category.name.toLowerCase().includes(keyword.toLowerCase());
			const hasMatchingChildren = category.children && filterCategories(category.children, keyword).length > 0;
			return matchesKeyword || hasMatchingChildren;
		}).map(category => ({
			...category,
			children: category.children ? filterCategories(category.children, keyword) : []
		}));
	};

	const treeifiedCategories = useMemo(() => buildCategoryTree(categories), [categories]);

	const filteredCategories = useMemo(() => {
		return searchKeyword ? filterCategories(treeifiedCategories, searchKeyword) : treeifiedCategories;
	}, [treeifiedCategories, searchKeyword]);

	const highlightText = (text, highlight) => {
		if (!highlight.trim()) {
			return <span>{text}</span>;
		}
		const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
		return (
			<span>
				{parts.map((part, i) =>
					part.toLowerCase() === highlight.toLowerCase() ?
						<span key={i} style={{ backgroundColor: 'yellow' }}>{part}</span> :
						part
				)}
			</span>
		);
	};

	const renderCategoryTree = (categories) => {
		return categories.map(category => ({
			title: (
				<Checkbox
					onChange={(e) => handleCheckboxChange(category, e)}
					disabled={disabled || isLoading}
					checked={selectedCategories.some(sc => sc.id === category.term_id)}
				>
					{highlightText(category.name.replace(/&amp;/g, "&").replace(/&amp;/g, "&"), searchKeyword)}
				</Checkbox>
			),
			key: category.term_id,
			children: category.children && category.children.length > 0 ? renderCategoryTree(category.children) : []
		}));
	};

	const handleRemoveCategory = (categoryId) => {
		const newSelectedCategories = selectedCategories.filter(sc => sc.id !== categoryId);
		setSelectedCategories(newSelectedCategories);
		if (onChange) {
			onChange(newSelectedCategories);
		}
	};

	const renderSelectedCategories = () => {
		if (!isLoading) {
			let values = Object.values(selectedCategories);
			if (values.length) {
				let categoriesTxt = values.length > 1 ? __('categories', 'affiliate-products-importer-for-woocommerce') : __('category', 'affiliate-products-importer-for-woocommerce');
				let categoriesName = values.map(category => (
					<Tag
						key={`tag${category.id}`}
						color='lime'
						closable
						onClose={(e) => {
							e.preventDefault();
							handleRemoveCategory(category.id);
						}}
						style={{
							marginBottom: '5px',
							paddingRight: '25px' // Increase padding on the right to make more room for the close icon
							}}
						closeIcon={
							<CloseOutlined
								style={{
									position: 'absolute',
									right: '5px',
									top: '50%',
									transform: 'translateY(-50%)',
									fontSize: '12px',
									padding: '4px', // Increase padding to make the clickable area larger
									borderRadius: '50%'
								}}
							/>
						}
					>
						{category.name.replace(/&amp;/g, "&")}
					</Tag>
				));
				return (
					<div style={{ marginTop: '10px' }}>
						<b>{__('Selected', 'affiliate-products-importer-for-woocommerce')} {categoriesTxt}</b>: <Space wrap>{categoriesName}</Space>
					</div>
				);
			} else if (displayError !== false) {
				return <div style={{ marginTop: '10px' }}><Text type="danger">{__('Please select at least one category to import products', 'affiliate-products-importer-for-woocommerce')}</Text></div>;
			}
			return null;
		}
		return null;
	};

	const reloadCategories = () => {
		dispatch(fetchCategories());
	};

	const renderReloadButton = () => {
		if (isLoading) {
			return <Button disabled={true} size='small' type="default" icon={<ReloadOutlined />} onClick={reloadCategories}></Button>;
		}

		return <Tooltip placement="topLeft" title={__('Reload Categories', 'affiliate-products-importer-for-woocommerce')} color='purple' key={'reload-categories'}>
			<Button size='small' type="default" icon={<ReloadOutlined />} onClick={reloadCategories}></Button>
		</Tooltip>;
	};

	const handleClearSearch = () => {
		setSearchKeyword('');
	};

	const showAddCategoryPopup = () => {
		setIsAddCategoryVisible(true);
	};

	const handleAddCategoryCancel = () => {
		setIsAddCategoryVisible(false);
	};

	const handleAddCategorySuccess = () => {
		setIsAddCategoryVisible(false);
		reloadCategories();
	};

	return (
		<div>
			<Card>
				<Row gutter={[16, 16]} align="middle">
					<Col span={12}>
						<Input
							placeholder={__('Search categories', 'affiliate-products-importer-for-woocommerce')}
							prefix={<SearchOutlined />}
							size="small"
							suffix={
								searchKeyword ? (
									<CloseCircleFilled
										style={{
											color: 'rgba(0, 0, 0, 0.45)',
											fontSize: '16px',
											cursor: 'pointer',
											padding: '8px',
											margin: '-8px',
											transition: 'color 0.3s',
										}}
										onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(0, 0, 0, 0.65)'}
										onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0, 0, 0, 0.45)'}
										onClick={handleClearSearch}
									/>
								) : null
							}
							onChange={handleSearch}
							value={searchKeyword}
						/>
					</Col>
					<Col span={12}>
						<Space style={{ width: '100%', justifyContent: 'flex-start' }}>
							<Tooltip placement="topLeft" title={__('Add a New Category', 'affiliate-products-importer-for-woocommerce')} color='purple' key={'add-category'}>
								<Button size='small' type="default" icon={<PlusOutlined />} onClick={showAddCategoryPopup}></Button>
							</Tooltip>
							{renderReloadButton()}
						</Space>
					</Col>
				</Row>
				{isLoading && (
					<Row style={{ marginTop: '16px' }}>
						<Col span={24}>
							<Space><Spin tip="" size="medium"> </Spin> <div>{__('Loading categories...', 'affiliate-products-importer-for-woocommerce')}</div></Space>
						</Col>
					</Row>
				)}
				<div className="affprodimp-product-categories" style={{ marginTop: '16px' }}>
					<Tree
						treeData={renderCategoryTree(filteredCategories)}
						defaultExpandAll
						selectable={false}
					/>
				</div>
			</Card>
			{renderSelectedCategories()}
			<AddCategoryPopup
				isOpen={isAddCategoryVisible}
				onCancel={handleAddCategoryCancel}
				onSuccess={handleAddCategorySuccess}
			/>
		</div>
	);
};

export default CategoriesCheckbox;
