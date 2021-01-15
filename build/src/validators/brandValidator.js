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
exports.updateTransaction = exports.createTransactions = exports.deleteBrandData = exports.updateBrandData = exports.brandData = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ['brand_name', 'brand_name_arabic'];
const brandData = (body) => {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(body)) {
        logger_1.default.error("brandData: body should not be empty");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    if (!genericValidator_1.checkIsSet(body.brand_name)) {
        logger_1.default.error("brandData: brand_name should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'brand_name not found in body', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(body.brand_name_arabic)) {
        logger_1.default.error("brandData: brand_name_arabic should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'brand_name_arabic not found in body', data: [] };
        return res;
    }
    logger_1.default.info("brandData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
};
exports.brandData = brandData;
const updateBrandData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(body)) {
        logger_1.default.error("brandData: body should not be empty");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(body), ['brand_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['brand_id'] };
        return res;
    }
    let getBrand = yield database_1.BrandTable.findAll({ where: { brand_id: body.brand_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound', data: body.brand_id };
        return res;
    }
    logger_1.default.info("updateBrandData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateBrandData = updateBrandData;
const deleteBrandData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(query), ['id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['brand_id'] };
        return res;
    }
    let getBrand = yield database_1.BrandTable.findAll({ where: { brand_id: query.id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound', data: query.brand_id };
        return res;
    }
    logger_1.default.info("deleteBrandData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.deleteBrandData = deleteBrandData;
const createTransactions = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(body), ['brand_id', 'branch_id', 'transaction_date']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['brand_id', 'branch_id', 'transaction_date'] };
        return res;
    }
    let getBrand = yield database_1.BranchTable.findAll({ where: { brand_id: body.brand_id, branch_id: body.branch_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand,branch id NotFound', data: body.brand_id };
        return res;
    }
    logger_1.default.info("deleteBrandData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.createTransactions = createTransactions;
const updateTransaction = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(body), ['branch_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['branch_id'] };
        return res;
    }
    let getBrand = yield database_1.BranchTable.findAll({ where: { branch_id: body.branch_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'branch id NotFound', data: body.brand_id };
        return res;
    }
    logger_1.default.info("deleteBrandData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateTransaction = updateTransaction;
//# sourceMappingURL=brandValidator.js.map