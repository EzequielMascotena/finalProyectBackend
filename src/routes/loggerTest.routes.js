const { Router } = require('express');
const addLogger = require('../config/logger');

const router = new Router()

//logger
router.get("/loggerTest", addLogger)

module.exports = router