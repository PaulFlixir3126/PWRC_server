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
exports.updateDeliveryAmountData = exports.updateDeliveryData = exports.deliveryDataPOST = exports.deliveryAmountDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ["brand_id", "branch_id", "local_amount", "non_local_amount", "delivery_time"];
const deliveryAmountDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let getBranch = yield database_1.BranchTable.findAll({ where: { brand_id: req.body.brand_id, branch_id: req.body.branch_id } });
    if (getBranch.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand,branch id NotFound', data: req.body.brand_id };
        return res;
    }
    let getDeliverAmtBranch = yield database_1.DeliveryAmountTable.findAll({ where: { branch_id: req.body.branch_id } });
    if (getDeliverAmtBranch.length > 0) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'branch id already exist', data: req.body.branch_id };
        return res;
    }
    logger_1.default.info("deliveryAmountDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.deliveryAmountDataPOST = deliveryAmountDataPOST;
const updateDeliveryAmountData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), ['branch_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['branch_id'] };
        return res;
    }
    let getBranch = yield database_1.DeliveryAmountTable.findAll({ where: { branch_id: req.body.branch_id } });
    console.log("grtbranch", getBranch);
    if (getBranch.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'branch id NotFound', data: req.body.branch_id };
        return res;
    }
    if (req.body.brand_id) {
        let getDeliverAmtBranch = yield database_1.DeliveryAmountTable.findAll({ where: { branch_id: req.body.branch_id, brand_id: req.body.brand_id } });
        console.log("getDeliverAmtBranch", getDeliverAmtBranch);
        if (getDeliverAmtBranch.length == 0) {
            let res = { status: false, code: 404, type: 'NotFound', message: 'branch,brand id NotFound', data: req.body.branch_id };
            return res;
        }
    }
    logger_1.default.info("deliveryAmountDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateDeliveryAmountData = updateDeliveryAmountData;
const deliveryDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let arr = ["brand_id", "status", "locality", "area_id", "branch_id"];
    let isArr = genericValidator_1.checkIsArrayAndNotEmpty(req.body);
    if (!isArr) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'body should be non empty array', data: req.body };
    }
    for (let i = 0; i < req.body.length; i++) {
        let found = genericValidator_1.checkall(Object.keys(req.body[i]), arr);
        if (!found) {
            return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        }
        let getarea = yield database_1.GlobalAreaTable.findAll({ where: { area_id: req.body[i].area_id } });
        if (getarea.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'area id NotFound', data: [] };
        }
        let getDeliveryArea = yield database_1.DeliveryTable.findAll({ where: { area_id: req.body[i].area_id } });
        if (getDeliveryArea.length > 0) {
            return { status: false, code: 400, type: 'invalidRequest', message: 'area already added', data: [] };
        }
    }
    logger_1.default.info("deliveryDataPOST: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.deliveryDataPOST = deliveryDataPOST;
const updateDeliveryData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let arr = ["delivery_id"];
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
    }
    let getDeliveryArea = yield database_1.DeliveryTable.findAll({ where: { delivery_id: req.body.delivery_id } });
    if (getDeliveryArea.length == 0) {
        return { status: false, code: 400, type: 'NotFound', message: 'delivery_id notfound', data: [] };
    }
    if (req.body.area_id) {
        let getarea = yield database_1.GlobalAreaTable.findAll({ where: { area_id: req.body.area_id } });
        if (getarea.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'area id NotFound', data: [] };
        }
    }
    logger_1.default.info("updateDeliveryData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateDeliveryData = updateDeliveryData;
//# sourceMappingURL=deliveryValidator.js.map