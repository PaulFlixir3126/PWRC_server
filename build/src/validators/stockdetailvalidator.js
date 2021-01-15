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
exports.stockOutSave = exports.sfstockcount = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const sfstockcount = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let validateCountedQty = yield checkCountedQty(body.data);
    if (!validateCountedQty.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: validateCountedQty.message, data: validateCountedQty.data };
        return res;
    }
    let validateItemids = yield checkitemId(body.data);
    if (!validateItemids.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: validateItemids.message, data: validateItemids.data };
        return res;
    }
    logger_1.default.info("sfstockcount: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'sfstockcount all validations passed', data: [] };
    return res;
});
exports.sfstockcount = sfstockcount;
const stockOutSave = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let transferType = ['warehouse_to_warehouse', 'warehouse_to_branch', 'branch_to_branch', 'branch_to_warehouse'];
    let bodymandatory = ['transfer_type', 'data'];
    let found = genericValidator_1.checkall(Object.keys(body), bodymandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: bodymandatory };
        return res;
    }
    let foundTransferType = genericValidator_1.includesIn(body.transfer_type, transferType);
    if (!foundTransferType) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'invalid transfer type', data: transferType };
        return res;
    }
    if (!genericValidator_1.checkIsArrayAndNotEmpty(body.data)) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'data should not be an empty array', data: [] };
        return res;
    }
    let checkTypeUnique = body.data.filter((ele) => {
        return ele.transfer_type == body.transfer_type;
    });
    if (checkTypeUnique.length != body.data.length) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'every transfer type should be unique', data: [] };
    }
    let validateCountedQty = yield checkQty(body.data);
    if (!validateCountedQty.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: validateCountedQty.message, data: validateCountedQty.data };
        return res;
    }
    logger_1.default.info("stockout: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'sfstockcount all validations passed', data: [] };
    return res;
});
exports.stockOutSave = stockOutSave;
let checkCountedQty = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getCountedQty = body.map((item) => { return item.countedqty; });
    let checkempty = getCountedQty.includes("");
    let checknull = getCountedQty.includes(null);
    let checkundefined = getCountedQty.includes(undefined);
    let checknaN = getCountedQty.includes(NaN);
    if (checkempty) {
        let obj = { status: false, message: "countedQty contains empty ", data: getCountedQty };
        return obj;
    }
    if (checknull) {
        let obj = { status: false, message: "countedQty contains null ", data: getCountedQty };
        return obj;
    }
    if (checkundefined) {
        let obj = { status: false, message: "countedQty contains undefined ", data: getCountedQty };
        return obj;
    }
    if (checknaN) {
        let obj = { status: false, message: "countedQty contains NaN ", data: getCountedQty };
        return obj;
    }
    let obj = { status: true, message: "countedQty values are correct ", data: getCountedQty };
    return obj;
});
let checkQty = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getCountedQty = body.map((item) => { return item.quantity; });
    let checkempty = getCountedQty.includes("");
    let checknull = getCountedQty.includes(null);
    let checkundefined = getCountedQty.includes(undefined);
    let checknaN = getCountedQty.includes(NaN);
    let checkZero_Negative = getCountedQty.some((v) => v <= 0);
    if (checkempty) {
        let obj = { status: false, message: "Quantity contains empty ", data: getCountedQty, checknaN };
        return obj;
    }
    if (checknull) {
        let obj = { status: false, message: "Quantity contains null ", data: getCountedQty };
        return obj;
    }
    if (checkundefined) {
        let obj = { status: false, message: "Quantity contains undefined ", data: getCountedQty };
        return obj;
    }
    if (checknaN) {
        let obj = { status: false, message: "Quantity contains NaN ", data: getCountedQty };
        return obj;
    }
    if (checkZero_Negative) {
        let obj = { status: false, message: "Quantity contains 0 or negative value ", data: getCountedQty };
        return obj;
    }
    let obj = { status: true, message: "Quantity values are correct ", data: getCountedQty };
    return obj;
});
let checkitemId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getitem_id = body.map((item) => { return item.item_id; });
    let checkempty = getitem_id.includes("");
    let checknull = getitem_id.includes(null);
    let checkundefined = getitem_id.includes(undefined);
    let item_id = body.map((ele) => { return ele.item_id; });
    let duplicateitem_id = item_id.filter((e, i, a) => a.indexOf(e) !== i);
    if (checkempty) {
        let obj = { status: false, message: "item_id contains empty ", data: getitem_id };
        return obj;
    }
    if (checknull) {
        let obj = { status: false, message: "item_id contains null ", data: getitem_id };
        return obj;
    }
    if (checkundefined) {
        let obj = { status: false, message: "item_id contains undefined ", data: getitem_id };
        return obj;
    }
    if (duplicateitem_id.length > 0) {
        let obj = { status: false, message: "duplicate itemids found ", data: duplicateitem_id };
        return obj;
    }
    let obj = { status: true, message: "item_id values are correct ", data: getitem_id };
    return obj;
});
//# sourceMappingURL=stockdetailvalidator.js.map