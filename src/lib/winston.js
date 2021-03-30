const { Container, transports } = require('winston');

// Create our default logging container
let container = new Container();

// Create a console transport and add it to the container
let transportConsole = new transports.Console({
	timestamp: true,
	colorize: true,
	level: 'debug',
});

container.add('console', {
	transports: [transportConsole],
});

/**
 * @static
 * @summary Logging container for the application
 */
module.exports = container;
