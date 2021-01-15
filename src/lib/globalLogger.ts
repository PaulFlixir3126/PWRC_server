import winston from 'winston';

let alignColorsAndTime = winston.format.combine(
	winston.format.colorize({
		all: false
	}),
	winston.format.label({
		label: '[PWSC]'
	}),
	winston.format.timestamp({
		format: "DD-MM-YYYY HH:MM:SS"
	})
)

const logger = winston.createLogger({
  transports: [
   new winston.transports.Console({
       level : 'silly' ,
       format: winston.format.combine(
         winston.format.colorize(),
         alignColorsAndTime,
         winston.format.printf(
           info => {
             const consoleMessage = `${info.label} ${info.timestamp} ${info.level} : ${info.message} \n`;
             return consoleMessage;
           }
         ))
     }),
   new (winston.transports.File)({filename: 'log/info.log', level : 'silly' }),
 ],
  // colorize: true,
  format: winston.format.combine(
   winston.format.timestamp({
    format: "DD-MM-YYYY HH:MM:SS"
   }),
   winston.format.json()
  ),
  handleExceptions: true
 });
export default logger;