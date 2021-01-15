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
exports.updateDiscountData = exports.discountDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ["brand_id", "discount_name", "discount_percentage", "discount_price", "discount_type", "discount_status"];
const discountDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
    logger_1.default.info("discountDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.discountDataPOST = discountDataPOST;
const updateDiscountData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), ['discount_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['discount_id'] };
        return res;
    }
    let getBrand = yield database_1.DiscountTable.findAll({ where: { discount_id: req.body.discount_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'discount id NotFound', data: req.body.brand_id };
        return res;
    }
    logger_1.default.info("updateDiscountData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateDiscountData = updateDiscountData;
//# sourceMappingURL=discountValidator.js.map