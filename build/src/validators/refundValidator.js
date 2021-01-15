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
exports.refundDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ["refund_amount", "branch_id", "order_id", "refund_status", "refund_data"];
const refundDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let getBranch = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, branch_id: req.body.branch_id } });
    if (getBranch.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'order,branch id NotFound', data: req.body.order_id };
        return res;
    }
    let gettransactiondate = yield database_1.transactionTable.findAll({ where: { transaction_date: req.body.transaction_date, branch_id: req.body.branch_id } });
    if (gettransactiondate.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'transactiondate NotFound', data: req.body.transaction_date };
        return res;
    }
    logger_1.default.info("refundDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.refundDataPOST = refundDataPOST;
//# sourceMappingURL=refundValidator.js.map