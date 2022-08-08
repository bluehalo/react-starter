'use-strict';

const { createClient } = require('redis'),
 	  session = require('express-session'),
	  throwIfCantConnect = true,
	  connectRedis = require('connect-redis'),
	  container = require('./winston'),
	  config = require('./../config/config');

let redisClient, RedisStore;

/**
 * @function initialize
 * @description Setup and configure passport
 * @param passport <Object> - Passport object to assign sessions to
 */
module.exports.initialize = function initialize(passport) {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		// TODO
		done();
	});

	// TODO: Load any strategies
};

module.exports.configureRedis = async () => {
    redisClient = createClient({
		url: 'redis://redis:6379',
		legacyMode: true
	});
    
    let prom = redisClient.connect();
    if (!throwIfCantConnect) {
        prom = prom.catch(err => {
            console.error(err);
        });
    }

    await prom;

	RedisStore = connectRedis(session);
}

module.exports.getSessionStore = () => {
    if (config.server.useRedis) {
		return new RedisStore({client: redisClient });
	}
	return undefined;
}