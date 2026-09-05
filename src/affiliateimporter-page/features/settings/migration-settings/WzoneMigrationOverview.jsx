import { Alert, Button, Typography } from 'antd';
import { __ } from '@wordpress/i18n';

const { Text, Link } = Typography;

const WzoneMigrationOverview = () => {
    
    return (
        <>
            <Text style={{fontSize: 16}}>
                {__(
                    'Already have products imported with ',
                    'affiliate-products-importer-for-woocommerce'
                )}
                <a 
                    href='https://codecanyon.net/item/woocommerce-amazon-affiliates-wordpress-plugin/3057503' target='_blank'
                    style={{fontWeight: 'bold'}}
                >
                    {__(
                        'WZone',
                        'affiliate-products-importer-for-woocommerce'
                    )}
                </a>
                {__(
                    '? You can migrate them to AmaSync. Please keep the following in mind:',
                    'affiliate-products-importer-for-woocommerce'
                )}
            </Text>

            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginTop: 20,
                        marginBottom: 10,
                    }}
                >
                    <span
                        style={{
                            marginLeft: 10,
                            fontSize: 18,
                            lineHeight: '24px',
                        }}
                    >
                        •
                    </span>
                    <span>
                        <Text strong>
                            {__(
                                'Only WZone-imported products',
                                'affiliate-products-importer-for-woocommerce'
                            )}
                        </Text>{' '}
                        {__(
                            'will be migrated. Other products will not be affected.',
                            'affiliate-products-importer-for-woocommerce'
                        )}
                    </span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 10,
                    }}
                >
                    <span
                        style={{
                            marginLeft: 10,
                            fontSize: 18,
                            lineHeight: '24px',
                        }}
                    >
                        •
                    </span>
                    <span>
                        {__('Only ', 'affiliate-products-importer-for-woocommerce')}
                        <Text strong>
                            {__(
                                'External/Affiliate and Simple',
                                'affiliate-products-importer-for-woocommerce'
                            )}
                        </Text>{' '}
                        {__(
                            'products are supported. Other product types can be skipped or moved to the Trash.',
                            'affiliate-products-importer-for-woocommerce'
                        )}
                    </span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 10,
                    }}
                >
                    <span
                        style={{
                            marginLeft: 10,
                            fontSize: 18,
                            lineHeight: '24px',
                        }}
                    >
                        •
                    </span>
                    <span>
                        {__('Only products ', 'affiliate-products-importer-for-woocommerce')}
                        <Text strong>
                            {__(
                                'that are still listed on Amazon',
                                'affiliate-products-importer-for-woocommerce'
                            )}
                        </Text>{' '}
                        {__(
                            'can be migrated. Products',
                            'affiliate-products-importer-for-woocommerce'
                        )}{' '}
                        <Text strong>
                            {__(
                                'removed from Amazon',
                                'affiliate-products-importer-for-woocommerce'
                            )}
                        </Text>{' '}
                        {__(
                            'can be skipped or moved to the Trash.',
                            'affiliate-products-importer-for-woocommerce'
                        )}
                    </span>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                }}
            >
                <Alert
                    message={
                        <>
                            {__(
                                'Note: the migration feature is only available to the ',
                                'affiliate-products-importer-for-woocommerce'
                            )}
                            <a 
                                href="https://woocommerce.com/products/amazon-affiliate-product-importer/"
                                target="_blank"
                            >
                                <b>{__('Pro version', 'affiliate-products-importer-for-woocommerce')}</b>
                            </a>
                        </>
                    }
                    type="warning"
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                }}
            >
                <Button
                    type="primary"
                    disabled
                >
                    {__(
                        'Check Products to Migrate',
                        'affiliate-products-importer-for-woocommerce'
                    )}
                </Button>
            </div>
        </>
    );
};

export default WzoneMigrationOverview;