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
exports.deleteBranchData = exports.updateBranchData = exports.branchData = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ['branch_name', 'branch_name_arabic', "take_out", "car_service", "staff_meal", "dine_in", "catering", "delivery", "branch_status"];
const branchData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(body)) {
        logger_1.default.error("branchData: body should not be empty");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    if (!genericValidator_1.checkIsSet(body.branch_name)) {
        logger_1.default.error("branchData: branch_name should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'branch_name not found in body', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(body.branch_name_arabic)) {
        logger_1.default.error("branchData: branch_name_arabic should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'branch_name_arabic not found in body', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(body.brand_id)) {
        logger_1.default.error("branchData: brand_id should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'brand_id not found in body', data: [] };
        return res;
    }
    let getBrand = yield database_1.BrandTable.findAll({ where: { brand_id: body.brand_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound', data: body.brand_id };
        return res;
    }
    logger_1.default.info("branchData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.branchData = branchData;
const updateBranchData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(body)) {
        logger_1.default.error("branchData: body should not be empty");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(body), ['branch_id', 'branch_name']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['branch_id', 'branch_name'] };
        return res;
    }
    let getBrand = yield database_1.BranchTable.findAll({ where: { branch_id: body.branch_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'branch id NotFound', data: body.branch_id };
        return res;
    }
    logger_1.default.info("updateBranchData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateBranchData = updateBranchData;
const deleteBranchData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(query), ['id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['id'] };
        return res;
    }
    let getBrand = yield database_1.BranchTable.findAll({ where: { branch_id: query.id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'branch id NotFound', data: query.id };
        return res;
    }
    logger_1.default.info("deleteBranchData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.deleteBranchData = deleteBranchData;
//# sourceMappingURL=branchValidator.js.map