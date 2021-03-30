const config = require('../config/config');
const AWS = require('aws-sdk');

// Initialize AWS settings if we have a config present
if (config.aws) {
	let settings = {};

	if (config.aws.region) {
		settings.region = config.aws.region;
	}

	if (config.aws.profile) {
		settings.credentials = new AWS.SharedIniFileCredentials({
			profile: config.aws.profile,
		});
	}

	AWS.config.update(settings);
}
