const controller = require('./health.controller');
const { Router } = require('express');

let router = new Router();

/**
 * @name /api/healthcheck
 * @description Healthcheck for load balancers
 * @memberOf Router
 * @see controller.healthcheck
 */
router.get('/api/healthcheck', controller.healthcheck);

module.exports = router;
