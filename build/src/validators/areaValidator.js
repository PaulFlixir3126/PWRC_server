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
exports.removeBlockData = exports.removeAreaData = exports.updateBlockData = exports.updateAreaData = exports.createBlock = exports.areaDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
const areaDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let arr = ['area_name_english', 'area_name_arabic'];
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
    }
    logger_1.default.info("areaDataPOST: all validations passed");
    return { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
});
exports.areaDataPOST = areaDataPOST;
const createBlock = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsArrayAndNotEmpty(req.body)) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty array', data: [] };
    }
    for (let i = 0; i < req.body.length; i++) {
        let getArea = yield database_1.GlobalAreaTable.findAll({ where: { area_id: req.body[i].area_id } });
        if (getArea.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'area id NotFound', data: req.body[i].area_id };
        }
        let getAreaBlock = yield database_1.BlockTable.findAll({ where: { area_id: req.body[i].area_id, block: req.body[i].block } });
        if (getAreaBlock.length > 0) {
            return { status: false, code: 409, type: 'Conflict', message: 'Block already added for this area', data: req.body[i].area_id };
        }
    }
    logger_1.default.info("createBlock: all validations passed");
    return { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
});
exports.createBlock = createBlock;
const updateAreaData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(req.body)) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
    }
    let found = genericValidator_1.checkall(Object.keys(req.body), ['area_id']);
    if (!found) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['area_id'] };
    }
    let getArea = yield database_1.GlobalAreaTable.findAll({ where: { area_id: req.body.area_id } });
    if (getArea.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'area id NotFound', data: req.body.area_id };
        return res;
    }
    logger_1.default.info("updateAreaData: all validations passed");
    return { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
});
exports.updateAreaData = updateAreaData;
const updateBlockData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(req.body)) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'body should not be empty', data: [] };
    }
    let found = genericValidator_1.checkall(Object.keys(req.body), ['block_id']);
    if (!found) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['block_id'] };
    }
    let getArea = yield database_1.BlockTable.findAll({ where: { block_id: req.body.block_id } });
    if (getArea.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'block id NotFound', data: req.body.block_id };
        return res;
    }
    logger_1.default.info("updateBlockData: all validations passed");
    return { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
});
exports.updateBlockData = updateBlockData;
const removeAreaData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.query), ['area_id']);
    if (!found) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['area_id'] };
    }
    let getArea = yield database_1.GlobalAreaTable.findAll({ where: { area_id: parseInt(req.query.area_id) } });
    if (getArea.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'area id NotFound', data: req.query.area_id };
        return res;
    }
    logger_1.default.info("removeAreaData: all validations passed");
    return { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
});
exports.removeAreaData = removeAreaData;
const removeBlockData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.query), ['block_id']);
    if (!found) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['block_id'] };
    }
    let getBlock = yield database_1.BlockTable.findAll({ where: { block_id: parseInt(req.query.block_id) } });
    if (getBlock.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'block id NotFound', data: req.query.block_id };
        return res;
    }
    logger_1.default.info("removeBlockData: all validations passed");
    return { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
});
exports.removeBlockData = removeBlockData;
//# sourceMappingURL=areaValidator.js.map