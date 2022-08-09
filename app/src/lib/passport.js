'use-strict';

const { createClient } = require('redis'),
 	  session = require('express-session'),
	  throwIfCantConnect = true,
	  connectRedis = require('connect-redis'),
	  container = require('./winston'),
	  config = require('./../config/config'),
	  logger = container.get('console');

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

/**
 * @function configureRedis
 * @description configures the redis connector in order to store the session keys 
 * in a remote location. Useful if you are running multiple servers without 
 * sticky load balancing
 */
//@TODO: Abstract this to be a generic remote store so we can make this work with mogno
module.exports.configureRedis = async () => {
	let conString = 'redis://';
	const redisConf = config.server.redis;

	if (redisConf.username && redisConf.password) {
		conString += `${redisConf.username}:${redisConf.password}@`;
	}
	conString += `${redisConf.host}:${redisConf.port}`;

    redisClient = createClient({
		url: conString,
		legacyMode: true
	});
    
    let prom = redisClient.connect();
    if (!throwIfCantConnect) {
        prom = prom.catch(err => {
            logger.error(err);
        });
    }

    await prom;

	RedisStore = connectRedis(session);
}

/**
 * @function getSessionStore
 * @description Returns a configured remote session store if available
 * @returns Remote session store if one has been configured
 */
module.exports.getSessionStore = () => {
    if (config.server.useRedis) {
		return new RedisStore({client: redisClient });
	}
	return undefined;
}