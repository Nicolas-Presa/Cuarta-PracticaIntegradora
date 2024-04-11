import winston from 'winston';
import { __DIRNAME } from '../utils.js';


const customErrLevel = {
    levels: {fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5},
    colors: {debug: 'green', http: 'white', info: 'blue', warning: 'yellow', error: 'magenta', fatal: 'red'}
}

// const devLogger = winston.createLogger({
//     levels: customErrLevel.levels,
//     transports: [
//         new winston.transports.Console({
//             level: 'debug',
//             format: winston.format.combine(
//                 winston.format.colorize({colors: customErrLevel.colors}),
//                 winston.format.simple()
//             )
//         })
//     ]
// })


const prodLogger = winston.createLogger({
    levels: customErrLevel.levels,
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: `${__DIRNAME}/logs/error.log`,
            format: winston.format.combine(
                winston.format.colorize({colors: customErrLevel.colors}),
                winston.format.simple()
            )}
            )
    ]
})

const addLogger = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.ip
    req.logger = prodLogger;
    req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url} [${ip}]`)
    next()
}

export default addLogger
