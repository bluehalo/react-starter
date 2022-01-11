const passport = require('passport');

/**
 * @function initialize
 * @description Setup and configure passport
 */
module.exports.initialize = function initialize() {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		// TODO
		done();
	});

	// TODO: Load any strategies
};
