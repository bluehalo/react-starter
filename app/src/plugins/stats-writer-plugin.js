const path = require('path');
const fs = require('fs');

/**
 * @class StatsWriterPlugin
 * @description Plugin for writing out statistics from webpack build
 */
module.exports = class StatsWriterPlugin {
	constructor(options = {}) {
		if (!options.filename) {
			throw new Error('Missing `filename`. Did you forget to provide `filename` to StatsWriterPlugin.');
		}

		this.dirname = path.dirname(options.filename);
		this.filename = options.filename;
		this.toJsonOptions = options.toJsonOptions || {
			modules: false,
			chunks: false,
		};
	}

	apply(compiler) {
		// Hook into the done compilation
		compiler.hooks.done.tap('StatsWriterPlugin', (stats) => {
			// Create the dir if it does not exists
			if (!fs.existsSync(this.dirname)) {
				fs.mkdirSync(this.dirname);
			}

			fs.writeFileSync(this.filename, JSON.stringify(stats.toJson(this.toJsonOptions), null, '\t'));
		});
	}
};
