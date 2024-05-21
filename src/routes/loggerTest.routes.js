const { Router } = require('express');
const addLogger = require('../config/logger');

const router = new Router();

// Endpoint para probar los loggers
router.get("/loggerTest", addLogger, (req, res) => {
    req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    req.logger.fatal(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);

    res.status(200).send("Loggers probados correctamente.");
});

module.exports = router;
