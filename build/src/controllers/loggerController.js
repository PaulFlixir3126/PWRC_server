"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsController = void 0;
const globalLogger_1 = __importDefault(require("../lib/globalLogger"));
const response_1 = require("../lib/response");
class logsController {
    sendlogs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let offset = req.query.offset ? req.query.offset : 0;
                let limit = req.query.limit ? req.query.limit : 25;
                const options = {
                    // from: ( new Date() - (24 * 60 * 60 * 1000) ),
                    // until: new Date(),
                    level: req.query.level,
                    limit: JSON.parse(limit),
                    start: JSON.parse(offset),
                    order: 'desc',
                    fields: ['message', 'level', 'timestamp']
                };
                globalLogger_1.default.query(options, function (err, results) {
                    if (err) {
                        return res.status(500).send({ status: false, message: `loggerQueryError:${err.message}`, data: [] });
                    }
                    return response_1.success(res, results);
                });
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while retriving server logs",
                    body: error.message
                });
            }
        });
    }
}
exports.logsController = logsController;
//# sourceMappingURL=loggerController.js.map