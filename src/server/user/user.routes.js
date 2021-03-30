const controller = require('./user.controller');
const { Router } = require('express');

let router = new Router();

/**
 * @name /api/user/active
 * @description Get the active user
 * @memberOf Router
 * @see controller.getActiveUser
 */
router.get('/api/user/active', controller.getActiveUser);

/**
 * @name /api/user/login
 * @description Attempt to login the current user
 * @memberOf Router
 * @see controller.login
 */
router.post('/api/user/login', controller.login);

module.exports = router;
