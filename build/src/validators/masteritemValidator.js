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
exports.updatequantity = void 0;
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
const updatequantity = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let itemCodeExist = yield checkItemcode(body);
    if (itemCodeExist.length > 0) {
        logger_1.default.error("updatequantity: item code not exist in database");
        let res = { status: false, code: 404, type: 'NotFound', message: 'item code not exist in database', data: itemCodeExist };
        return res;
    }
    let checkZeroQty = yield checkZero(body);
    if (checkZeroQty) {
        logger_1.default.error("updatequantity: transfer Qty should not be zero");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'transfer Qty should not be zero', data: checkZeroQty };
        return res;
    }
    let itemQty = yield checkItemQty(body);
    if (itemQty.length > 0) {
        logger_1.default.error("updatequantity: some item quantity are greater than the expected quantity");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'some item quantity are greater than the expected quantity', data: itemQty };
        return res;
    }
    logger_1.default.info("updatequantity: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updatequantity = updatequantity;
let checkItemcode = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let itemcodes = body.map((item) => { return item.item_code; });
    let checkitemcode = yield database_1.MasterItemTable.findAll({ where: { item_code: itemcodes } });
    let DBitemcodes = JSON.parse(JSON.stringify(checkitemcode)).map((item) => { return item.item_code; });
    let nonexistingItemcode = itemcodes.filter((arr1Item) => !DBitemcodes.includes(arr1Item));
    return nonexistingItemcode;
});
let checkZero = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let checkZeroVaules = body.map((item) => { return parseFloat(item.transferQty); });
    var zero = checkZeroVaules.includes(0);
    if (zero) {
        return true;
    }
    else {
        return false;
    }
});
let checkItemQty = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let itemcodes1 = body.map((item) => { return item.item_code; });
    let itemcodes = body.map((item) => { return { item_code: item.item_code, TransferQty: item.transferQty }; });
    let getDBQty = yield database_1.StockDetailTable.findAll({ where: { item_code: itemcodes1, brand_id: body[0].brand_id, branch_id: body[0].branch_id } });
    let DBitemcodes = JSON.parse(JSON.stringify(getDBQty)).map((item) => { return { item_code: item.item_code, quantity: item.quantity }; });
    let noncorrectQty = [];
    for (let i = 0; i < itemcodes.length; i++) {
        for (let j = 0; j < DBitemcodes.length; j++) {
            if (itemcodes[i].item_code == DBitemcodes[j].item_code) {
                if (!(itemcodes[i].TransferQty <= DBitemcodes[j].quantity)) {
                    noncorrectQty.push({ item_code: itemcodes[i].item_code, requestedQty: itemcodes[i].TransferQty, DBQty: DBitemcodes[j].quantity });
                }
            }
        }
    }
    return noncorrectQty;
});
//# sourceMappingURL=masteritemValidator.js.map