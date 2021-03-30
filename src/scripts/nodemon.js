const container = require('../lib/winston');
const nodemon = require('nodemon');

let logger = container.get('console');

nodemon({
	ignore: ['node_modules', 'src/client/**/*.js'],
	script: 'src/scripts/develop.js',
	ext: 'js pug json',
	verbose: true,
	watch: ['src/**/*.json', 'src/**/*.pug', 'src/**/*.js'],
});

nodemon
	.on('restart', (files) => logger.verbose(`Nodemon restarting because ${files.join(',')} changed.`))
	.on('crash', () => logger.verbose('Nodemon crashed. Waiting for changes to restart.'));

// Make sure the process actually dies when hitting ctrl + c
process.once('SIGINT', () => {
	nodemon.once('exit', () => {
		logger.info('Terminating Nodemon.');
		process.exit();
	});
});
