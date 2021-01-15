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
exports.updateData = exports.postData = exports.startShiftData = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ["brand_id", "branch_id", "brand_name", "branch_name", "float_amount_start", "cashier_name", "cashier_id", "transaction_date"];
const startShiftData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(query)) {
        logger_1.default.error('startShiftData: query should not be empty');
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'query should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(query), ['brand_id', 'branch_id', 'cashier_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['brand_id', 'branch_id', 'cashier_id'] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(query.brand_id)) {
        logger_1.default.error('startShiftData: brand_id should not be undefined,null');
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'brand_id not found in query', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(query.branch_id)) {
        logger_1.default.error('startShiftData: branch_id should not be undefined,null');
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'branch_id not found in query', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(query.cashier_id)) {
        logger_1.default.error('startShiftData: cashier_id should not be undefined,null');
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'cashier_id not found in query', data: [] };
        return res;
    }
    if (query.branch_id === 'undefined' ||
        query.brand_id === 'undefined' ||
        query.cashier_id === 'undefined') {
        logger_1.default.error('startShiftData: branch_id,brand_id,cashier_id should not be undefined,null');
        let res = {
            status: false,
            message: ' branch_id,brand_id,cashier_id  not found in query',
            code: 400, type: 'invalidRequest',
            data: []
        };
        return res;
    }
    let getBrand = yield database_1.BranchTable.findAll({ where: { branch_id: query.branch_id, brand_id: query.brand_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'branch,brand id NotFound', data: query.branch_id };
        return res;
    }
    logger_1.default.info('startShiftData: all validations passed');
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.startShiftData = startShiftData;
const postData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(body)) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let getBrand = yield database_1.BranchTable.findAll({ where: { branch_id: body.branch_id, brand_id: body.brand_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'branch,brand id NotFound', data: body.branch_id };
        return res;
    }
    let gettransactiondate = yield database_1.transactionTable.findAll({ where: { transaction_date: body.transaction_date, brand_id: body.brand_id, branch_id: body.branch_id } });
    if (gettransactiondate.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'transactiondate NotFound', data: body.transaction_date };
        return res;
    }
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.postData = postData;
const updateData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['end_shift_id', 'float_amount_end', 'end_shift_status', 'cashier_data', 'extra_cash', 'short_cash', 'cashier_due'];
    if (!genericValidator_1.checkIsObjectAndNotEmpty(body)) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(body), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    let getEndshift = yield database_1.EndShiftTable.findAll({ where: { end_shift_id: body.end_shift_id } });
    if (getEndshift.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'endshift id NotFound', data: body.branch_id };
        return res;
    }
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateData = updateData;
//# sourceMappingURL=endShiftValidator.js.map