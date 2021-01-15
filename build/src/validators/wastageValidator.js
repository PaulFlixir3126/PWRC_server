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
exports.addwastage = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
const addwastage = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsArrayAndNotEmpty(body)) {
        logger_1.default.error("addwastage: body should not be an empty array");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should not be an empty array', data: [] };
        return res;
    }
    let WastageNegative_Zero = yield checkNegative_Zero_wastageQty(body);
    if (WastageNegative_Zero) {
        logger_1.default.error("addwastage: item wastage quantity must be greater than zero");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'item wastage quantity must be greater than zero', data: [] };
        return res;
    }
    let AvailableNegative_Zero = yield checkNegative_Zero_availableQty(body);
    if (AvailableNegative_Zero) {
        logger_1.default.error("addwastage: item available quantity must be greater than zero");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'item available quantity must be greater than zero', data: [] };
        return res;
    }
    let itemCodeExist = yield checkItemId(body);
    if (itemCodeExist.length > 0) {
        logger_1.default.error("updatequantity: item id not exist in database");
        let res = { status: false, code: 404, type: 'NotFound', message: 'item id NotFound', data: itemCodeExist };
        return res;
    }
    logger_1.default.info("addwastage: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.addwastage = addwastage;
let checkNegative_Zero_wastageQty = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getItemQuantity = body.map((item) => { return item.wastageQty; });
    let hasNegative = getItemQuantity.some((item) => parseFloat(item) <= 0);
    return hasNegative;
});
let checkNegative_Zero_availableQty = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getItemQuantity = body.map((item) => { return item.avaliableQty; });
    let hasNegative = getItemQuantity.some((item) => item <= 0);
    return hasNegative;
});
// let checkItem_id = async(body:any) =>{
//   let getItem_id = body.map((item:any) => { return item.item_id });
//   let emptyStrings = getItem_id.filter((str:any) => str.trim().length <= 0);
//   return emptyStrings;
// }
let checkItemId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let itemids = body.map((item) => { return item.item_id; });
    let checkitemcode = yield database_1.StockDetailTable.findAll({ where: { item_id: itemids, brand_id: body[0].brand_id, branch_id: body[0].branch_id } });
    let DBitemcodes = JSON.parse(JSON.stringify(checkitemcode)).map((item) => { return item.item_id; });
    let nonexistingItemcode = itemids.filter((arr1Item) => !DBitemcodes.includes(arr1Item));
    return nonexistingItemcode;
});
//# sourceMappingURL=wastageValidator.js.map