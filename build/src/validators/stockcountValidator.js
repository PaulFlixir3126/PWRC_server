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
exports.stockcountsave = exports.stockcountupdate = void 0;
const logger_1 = __importDefault(require("../lib/logger"));
const stockcountupdate = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let validateCountedQty = yield checkCountedQty(body.data);
    if (!validateCountedQty.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: validateCountedQty.message, data: validateCountedQty.data };
        return res;
    }
    logger_1.default.info("stockcountupdate: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.stockcountupdate = stockcountupdate;
const stockcountsave = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let validateCountedQty = yield checkCountedQty(body.data);
    if (!validateCountedQty.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: validateCountedQty.message, data: validateCountedQty.data };
        return res;
    }
    logger_1.default.info("stockcountsave: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.stockcountsave = stockcountsave;
let checkCountedQty = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getCountedQty = body.map((item) => { return item.countedQty; });
    let checkempty = getCountedQty.includes("");
    let checknull = getCountedQty.includes(null);
    let checkundefined = getCountedQty.includes(undefined);
    if (checkempty) {
        let obj = { status: false, message: "countedQty contains '' ", data: getCountedQty };
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
    let obj = { status: true, message: "countedQty values are correct ", data: getCountedQty };
    return obj;
});
let checkitemId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let getitem_id = body.map((item) => { return item.item_id; });
    let checkempty = getitem_id.includes("");
    let checknull = getitem_id.includes(null);
    let checkundefined = getitem_id.includes(undefined);
    if (checkempty) {
        let obj = { status: false, message: "item_id contains '' ", data: getitem_id };
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
    let obj = { status: true, message: "item_id values are correct ", data: getitem_id };
    return obj;
});
//# sourceMappingURL=stockcountValidator.js.map