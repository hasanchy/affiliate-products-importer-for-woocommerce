import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { createCategory } from '../../services/apiService';
import { useSelector } from 'react-redux';
import { __ } from '@wordpress/i18n';

const AddCategoryPopup = ({ isOpen, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { categories, isLoading } = useSelector((state) => state.categories);

    const formatCategories = (categories, prefix = '') => {
        return categories.map(category => ({
        value: category.term_id,
        label: prefix + category.name?.replace(/&amp;/g, "&"),
        children: category.children && category.children.length > 0
            ? formatCategories(category.children, prefix + '-- ')
            : undefined
        }));
    };

    const categoryOptions = useMemo(() => formatCategories(categories), [categories]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await createCategory(values);
            message.success(__('Category created successfully', 'affiliate-products-importer-for-woocommerce'));
            form.resetFields();
            onSuccess();
        } catch (error) {
            message.error(__('Failed to create category', 'affiliate-products-importer-for-woocommerce'));
        } finally {
            setLoading(false);
        }
    };

    // Custom filter function for the Select component
    const filterOption = (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    return (
        <Modal
            open={isOpen}
            title={__('Add New Category', 'affiliate-products-importer-for-woocommerce')}
            onCancel={onCancel}
            footer={null}
        >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
                name="name"
                label={__('Category Name', 'affiliate-products-importer-for-woocommerce')}
                rules={[{ required: true, message: __('Please enter category name', 'affiliate-products-importer-for-woocommerce') }]}
            >
            <Input />
            </Form.Item>
            <Form.Item name="parent" label={__('Parent Category', 'affiliate-products-importer-for-woocommerce')}>
            <Select
                placeholder={__('Select parent category', 'affiliate-products-importer-for-woocommerce')}
                allowClear
                showSearch
                filterOption={filterOption}
                options={categoryOptions}
                loading={isLoading}
                disabled={isLoading}
                optionFilterProp="label"
            />
            </Form.Item>
            <Form.Item name="description" label={__('Description', 'affiliate-products-importer-for-woocommerce')}>
            <Input.TextArea />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
                {__('Create Category', 'affiliate-products-importer-for-woocommerce')}
            </Button>
            </Form.Item>
        </Form>
        </Modal>
    );
};

export default AddCategoryPopup;
