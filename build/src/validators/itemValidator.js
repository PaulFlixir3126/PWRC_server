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
exports.deleteItemData = exports.updateItemData = exports.itemDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ['item_name', 'item_name_arabic', 'brand_id'];
const itemDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let checkReqBody = genericValidator_1.checkIsObjectAndNotEmpty(req.body);
    if (!checkReqBody) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'req body is is empty', data: req.body };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let getBrand = yield database_1.BrandTable.findAll({ where: { brand_id: req.body.brand_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound', data: req.body.brand_id };
        return res;
    }
    logger_1.default.info("itemDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.itemDataPOST = itemDataPOST;
const updateItemData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let checkReqBody = genericValidator_1.checkIsObjectAndNotEmpty(req.body);
    if (!checkReqBody) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'req body is is empty', data: req.body };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(req.body), ['item_id', 'brand_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['item_id', 'brand_id'] };
        return res;
    }
    let getitems = yield database_1.ItemTable.findAll({ where: { item_id: req.body.item_id } });
    if (getitems.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'invalid item id ', data: req.body.item_id };
        return res;
    }
    let getitemwithbrand = yield database_1.ItemTable.findAll({ where: { item_id: req.body.item_id, brand_id: req.body.brand_id } });
    if (getitemwithbrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'item id does not match with brand', data: req.body.item_id };
        return res;
    }
    logger_1.default.info("updateItemData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateItemData = updateItemData;
const deleteItemData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let checkReqBody = genericValidator_1.checkIsObjectAndNotEmpty(req.query);
    if (!checkReqBody) {
        let res = { status: false, message: 'req query is is empty', data: req.query };
        return res;
    }
    let found = genericValidator_1.checkall(Object.keys(req.query), ['id', 'brand_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['item_id', 'brand_id'] };
        return res;
    }
    let getitems = yield database_1.ItemTable.findAll({ where: { item_id: req.query.id } });
    if (getitems.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'item id notfound ', data: req.query.id };
        return res;
    }
    let getitemwithbrand = yield database_1.ItemTable.findAll({ where: { item_id: req.query.id, brand_id: req.query.brand_id } });
    if (getitemwithbrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'item id does not match with brand', data: req.query.id };
        return res;
    }
    logger_1.default.info("updateItemData: all validations passed");
    let res = { status: true, code: 200, type: 'Success', message: 'all validations passed', data: [] };
    return res;
});
exports.deleteItemData = deleteItemData;
//# sourceMappingURL=itemValidator.js.map