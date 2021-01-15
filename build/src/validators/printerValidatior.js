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
exports.deletePrinterData = exports.updatePrinterData = exports.printerDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ["printer_ip", "printer_name", "printer_status"];
const printerDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    logger_1.default.info("printerDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.printerDataPOST = printerDataPOST;
const updatePrinterData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), ['id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['id'] };
        return res;
    }
    const getprint = yield database_1.PrintConfigTable.findAll({ where: { printer_id: req.body.id } });
    if (getprint.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'printer id NotFound', data: req.body.id };
        return res;
    }
    logger_1.default.info("printerDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updatePrinterData = updatePrinterData;
const deletePrinterData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.query), ['id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['id'] };
        return res;
    }
    const getprint = yield database_1.PrintConfigTable.findAll({ where: { printer_id: req.query.id } });
    if (getprint.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'printer id NotFound', data: req.query.id };
        return res;
    }
    logger_1.default.info("printerDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.deletePrinterData = deletePrinterData;
//# sourceMappingURL=printerValidatior.js.map