const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = {
	mode: env === 'production' ? env : 'development',
	devtool: env === 'production' ? 'hidden-source-map' : 'eval-source-map',
	entry: ['./app/index.js'],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /.js$/,
				include: path.join(__dirname, 'app'),
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
					/* see .babelrc for options */
				}
			}
		]
	}
};
