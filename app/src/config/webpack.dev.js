const StatsWriterPlugin = require('../plugins/stats-writer-plugin');
const getEnvironment = require('./webpack.env');
const webpack = require('webpack');
const config = require('./config');
const path = require('path');

/**
 * @name exports
 * @summary Webpack development configurations
 */
module.exports = {
	target: ['web', 'es5'],
	mode: 'development',
	profile: true,
	entry: {
		main: ['webpack-hot-middleware/client', path.resolve('src/client/index')],
	},
	output: {
		path: path.join(process.cwd(), config.server.publicDirectory),
		publicPath: `/${config.server.publicDirectory}/`,
		filename: '[name].[contenthash].js',
	},
	devtool: 'inline-source-map',
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
			},
		],
	},
	plugins: [
		new StatsWriterPlugin({ filename: path.posix.resolve('./bin/stats.json') }),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin(getEnvironment()),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: 'common',
		},
	},
};
