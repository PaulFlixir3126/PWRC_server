import winston from 'winston';

const logger = winston.createLogger();


if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({
        filename: __dirname + '/error.log'
    }));
}


export default logger;