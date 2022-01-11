const StatsWriterPlugin = require('../../stats-writer-plugin');
const path = require('path');

module.exports = {
	mode: 'production',
	entry: path.join(__dirname, './index'),
	output: {
		path: __dirname,
		filename: 'bundle.js',
	},
	plugins: [
		new StatsWriterPlugin({
			filename: path.join(__dirname, './output.json'),
		}),
	],
};
