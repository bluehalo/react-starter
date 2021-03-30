const StatsWriterPlugin = require('./stats-writer-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// Output path of integration tests
let simpleBundlePath = path.join(__dirname, 'cases/stats-writer-simple/bundle.js');
let simpleOutputPath = path.join(__dirname, 'cases/stats-writer-simple/output.json');
let newdirBundlePath = path.join(__dirname, 'cases/stats-writer-newdir/bundle.js');
let newdirOutputPath = path.join(__dirname, 'cases/stats-writer-newdir/new/output.json');

describe('Stats Writer Plugin Tests', () => {
	// Delete all the files created during our integration tests
	afterAll(() => {
		fs.unlinkSync(simpleBundlePath);
		fs.unlinkSync(simpleOutputPath);
		fs.unlinkSync(newdirBundlePath);
		fs.unlinkSync(newdirOutputPath);
		fs.rmdirSync(path.dirname(newdirOutputPath));
	});

	describe('Plugin Constructor Tests', () => {
		test('throws if no filename is given', () => {
			expect(() => {
				// eslint-disable-next-line no-unused-vars
				let plugin = new StatsWriterPlugin();
			}).toThrow('Missing `filename`');
		});

		test('can override default toJsonOptions', () => {
			let defaults = { modules: false, chunks: false };
			let options = { foo: 'bar' };
			let defaultPlugin = new StatsWriterPlugin({ filename: 'foo.txt' });
			let overridePlugin = new StatsWriterPlugin({
				filename: 'foo.txt',
				toJsonOptions: options,
			});

			expect(defaultPlugin.toJsonOptions).toEqual(defaults);
			expect(overridePlugin.toJsonOptions).toEqual(options);
		});
	});

	describe('Webpack Integration Tests', () => {
		test('should output stats for a simple build', (done) => {
			let options = require('./cases/stats-writer-simple/webpack.config');
			let defaults = { modules: false, chunks: false };

			webpack(options, (err, stats) => {
				let outstats = require(simpleOutputPath);
				expect(err).toBeNull();
				expect(stats.toJson(defaults)).toEqual(outstats);
				done(err);
			});
		});

		test('should create the destination directory if it does not exist', (done) => {
			let options = require('./cases/stats-writer-newdir/webpack.config');
			let defaults = { modules: false, chunks: false };

			webpack(options, (err, stats) => {
				let outstats = require(newdirOutputPath);
				expect(err).toBeNull();
				expect(stats.toJson(defaults)).toEqual(outstats);
				done(err);
			});
		});
	});
});
