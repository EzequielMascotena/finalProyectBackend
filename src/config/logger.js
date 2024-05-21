const winston = require('winston');

const config = require('./config')


//seteo de options
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        info: 'blue',
        http: 'cyan',
        debug: 'grey'
    }
}

winston.addColors(customLevelOptions.colors)


// Configuración del logger
const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: "error",
            format: winston.format.simple()
        })
    ]
});


const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: "error",
            format: winston.format.simple()
        })
    ]
});

// Creación del middleware
const addLogger = (req, res, next) => {

    if (config.enviroment === "dev") {
        req.logger = devLogger
    } else {
        req.logger = prodLogger
    }

    next()
};

module.exports = addLogger;
