const StatsWriterPlugin = require('../plugins/stats-writer-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getEnvironment = require('./webpack.env');
const webpack = require('webpack');
const config = require('./config');
const path = require('path');

/**
 * @name exports
 * @summary Webpack production configurations
 */
module.exports = {
	target: ['web', 'es5'],
	mode: 'production',
	entry: {
		main: path.resolve('src/client/index'),
	},
	output: {
		path: path.join(process.cwd(), 'bin', config.server.publicDirectory),
		publicPath: `/${config.server.publicDirectory}/`,
		filename: '[name].[contenthash].js',
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /(node_modules)/,
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
				exclude: /app\.scss$/,
			},
			{
				test: /app\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new StatsWriterPlugin({ filename: path.resolve('./bin/stats.json') }),
		new MiniCssExtractPlugin({ filename: 'app.[contenthash].css' }),
		new webpack.DefinePlugin(getEnvironment()),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: 'common',
		},
	},
};
