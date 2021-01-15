"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
let alignColorsAndTime = winston_1.default.format.combine(winston_1.default.format.colorize({
    all: false
}), winston_1.default.format.label({
    label: '[PWSC]'
}), winston_1.default.format.timestamp({
    format: "DD-MM-YYYY HH:MM:SS"
}));
const logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            level: 'silly',
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), alignColorsAndTime, winston_1.default.format.printf(info => {
                const consoleMessage = `${info.label} ${info.timestamp} ${info.level} : ${info.message} \n`;
                return consoleMessage;
            }))
        }),
        new (winston_1.default.transports.File)({ filename: 'log/info.log', level: 'silly' }),
    ],
    // colorize: true,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "DD-MM-YYYY HH:MM:SS"
    }), winston_1.default.format.json()),
    handleExceptions: true
});
exports.default = logger;
//# sourceMappingURL=globalLogger.js.map