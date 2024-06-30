const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	...defaultConfig,
	entry: {
		'affiliateimporterpage': './src/affiliateimporter-page/main.jsx'
	},
	output: {
		path: path.resolve(__dirname, 'assets/js'),
		filename: '[name].min.js',
		assetModuleFilename: 'images/[name][ext][query]',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	devServer:{
		devMiddleware: {
			writeToDisk: true,
		},
		allowedHosts: 'auto',
		host: 'localhost',
		port: 8892,
		proxy: {
			'/build': {
				pathRewrite: {
					'^/build': '',
				},
			},
		},
	},
	plugins: [
        ...defaultConfig.plugins,
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '../css/[name].min.css',
		}),
	],
	optimization: {
        minimize: isProduction,
        minimizer: isProduction
            ? [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ]
            : [],
    },
};