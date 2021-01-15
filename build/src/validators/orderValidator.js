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
exports.driverReAssign = exports.savecallcenterorder = exports.driverAssignPOSOrder = exports.getcallcenterorder = exports.transferorder = exports.driverassign = exports.updateOrderData = exports.orderDataPost = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ['transaction_date', 'end_shift_id', 'brand_id', 'branch_id', 'user_id', 'order_details', 'segment_key'];
const orderDataPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let checkorderdetails = genericValidator_1.checkIsArrayAndNotEmpty(req.body.order_details);
    if (!checkorderdetails) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'order details is empty', data: req.body.order_details };
        return res;
    }
    // if((req.body.user_role != 'waiter')){
    //   let getendshift: any = await EndShiftTable.findAll({where: { end_shift_id: req.body.end_shift_id}});
    //   if(getendshift.length == 0){
    //     let res = {status:false,code: 404, type:'NotFound', message:'endshift id NotFound', data:req.body.end_shift_id}
    //     return res
    //   }
    // }
    // if((req.body.user_role != 'cc_agent')){
    //   let getendshift: any = await EndShiftTable.findAll({where: { end_shift_id: req.body.end_shift_id}});
    //   if(getendshift.length == 0){
    //     let res = {status:false,code: 404, type:'NotFound', message:'endshift id NotFound', data:req.body.end_shift_id}
    //     return res
    //   }
    // }
    let gettransactiondate = yield database_1.transactionTable.findAll({ where: { transaction_date: req.body.transaction_date,
            brand_id: req.body.brand_id,
            branch_id: req.body.branch_id } });
    if (gettransactiondate.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'transactiondate NotFound', data: req.body.transaction_date };
        return res;
    }
    logger_1.default.info("orderDataPost: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.orderDataPost = orderDataPost;
const updateOrderData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let getorder = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id } });
    if (getorder.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'order id NotFound ', data: req.body.order_id };
        return res;
    }
    logger_1.default.info("updateOrderData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateOrderData = updateOrderData;
const driverassign = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['status', 'order_id', 'driver_id'];
    let found = genericValidator_1.checkall(Object.keys(req.body), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    let getorder = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, callcenterorder: true } });
    if (getorder.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'order id NotFound ', data: req.body.order_id };
        return res;
    }
    let status = '';
    /**for driver_assigned: order should be 'Saved'  */
    // if (req.body.status == 'driver_assigned') {
    //   status = 'Saved'
    // }
    /**for driver_out: order should be 'drvier_assigned'  */
    if (req.body.status == 'driver_out') {
        status = 'Saved';
    }
    /**for driver_in: order should be 'driver_out' */
    if (req.body.status == 'driver_in') {
        status = 'driver_out';
    }
    let checkorderStatus = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, status: status, callcenterorder: true } });
    if (checkorderStatus.length == 0) {
        return { status: false, code: 404, type: 'NotFound', message: `order status should be ${status}`, data: req.body.order_id };
    }
    logger_1.default.info("driverassign: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.driverassign = driverassign;
const driverReAssign = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['old_driver_id', 'driver_id'];
    let found = genericValidator_1.checkall(Object.keys(req.body), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    let getorder = yield database_1.OrderTable.findAll({ where: { driver_id: req.body.old_driver_id,
            callcenterorder: true,
            status: { [database_1.Op.or]: ['driver_assigned', 'driver_out'] }
        } });
    if (getorder.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound',
            message: `orders NotFound for driver or order status should be 'driver_assigned' or 'driver_out' `,
            data: req.body.old_driver_id };
        return res;
    }
    logger_1.default.info("driverReAssign: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.driverReAssign = driverReAssign;
const driverAssignPOSOrder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['segment_key', 'order_id', 'driver_id', 'status'];
    let found = genericValidator_1.checkall(Object.keys(req.body), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    let getorder = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, callcenterorder: false, segment_key: req.body.segment_key } });
    if (getorder.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'order id NotFound ', data: req.body.order_id };
        return res;
    }
    let checkorderStatus = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, status: 'Saved', callcenterorder: false } });
    if (checkorderStatus.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: `you cant assign now order status is not 'Saved'`, data: req.body.order_id };
        return res;
    }
    logger_1.default.info("driverAssignPOSOrder: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.driverAssignPOSOrder = driverAssignPOSOrder;
const transferorder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['status', 'order_id', 'brand_id', 'branch_id'];
    let found = genericValidator_1.checkall(Object.keys(req.body), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    let getorder = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, callcenterorder: true } });
    if (getorder.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'order id NotFound ', data: req.body.order_id };
        return res;
    }
    let branch = yield database_1.BranchTable.findAll({ where: { branch_id: req.body.branch_id, brand_id: req.body.brand_id } });
    if (branch.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand,branch id NotFound ', data: req.body.branch_id };
        return res;
    }
    let checkorderStatus = yield database_1.OrderTable.findAll({ where: { order_id: req.body.order_id, status: 'Saved', callcenterorder: true } });
    if (checkorderStatus.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: `you can't transfer now order status is not 'Saved'`, data: req.body.order_id };
        return res;
    }
    logger_1.default.info("transferorder: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.transferorder = transferorder;
const getcallcenterorder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['filterbybranch', 'filterbybrand', 'filterbyorder', 'filterbycustomer', 'filterbystatus', 'filterbysegment', 'filterbyuser',
        'filterbydriver', 'filterbyrole'];
    let found = genericValidator_1.checkall(Object.keys(req.query), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    logger_1.default.info("getcallcenterorder: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.getcallcenterorder = getcallcenterorder;
const savecallcenterorder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let mandatory = ['transaction_date', 'end_shift_id', 'brand_id', 'branch_id', 'user_id', 'order_details', 'segment_key', 'user_role',
        'customer_id', 'cc_transaction_date'];
    let found = genericValidator_1.checkall(Object.keys(req.body), mandatory);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: mandatory };
        return res;
    }
    let checkorderdetails = genericValidator_1.checkIsArrayAndNotEmpty(req.body.order_details);
    if (!checkorderdetails) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'order details is empty', data: req.body.order_details };
        return res;
    }
    let gettransactiondate = yield database_1.transactionTable.findAll({ where: { transaction_date: req.body.transaction_date, brand_id: req.body.brand_id, branch_id: req.body.branch_id } });
    if (gettransactiondate.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'transactiondate NotFound', data: req.body.transaction_date };
        return res;
    }
    let getCallcenterTransactiondate = yield database_1.CCtransactionTable.findAll({ where: { cc_transaction_date: req.body.cc_transaction_date } });
    if (getCallcenterTransactiondate.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'this callcenter transactiondate NotFound', data: req.body.cc_transaction_date };
        return res;
    }
    if (req.body.discount_id != null || req.body.discount_id != undefined) {
        let GetDistcount = yield database_1.DiscountTable.findAll({ where: { discount_id: req.body.discount_id, brand_id: req.body.brand_id } });
        if (GetDistcount.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'discount id NotFound', data: req.body.discount_id };
        }
    }
    if (req.body.onlinetype_id != null || req.body.onlinetype_id != undefined) {
        let GetOnlineType = yield database_1.OnlineTypeTable.findAll({ where: { onlinetype_id: req.body.onlinetype_id, online_status: true } });
        if (GetOnlineType.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'onlinetype id NotFound', data: req.body.onlinetype_id };
        }
    }
    if (req.body.delivery_id != null || req.body.delivery_id != undefined) {
        let GetDelivery = yield database_1.DeliveryTable.findAll({ where: { delivery_id: req.body.delivery_id, brand_id: req.body.brand_id, branch_id: req.body.branch_id, status: true } });
        if (GetDelivery.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'delivery id NotFound', data: req.body.delivery_id };
        }
    }
    if (req.body.delivery_amount_id != null || req.body.delivery_amount_id != undefined) {
        let getDeliveryAmount = yield database_1.DeliveryAmountTable.findAll({ where: { delivery_amount_id: req.body.delivery_amount_id, brand_id: req.body.brand_id, branch_id: req.body.branch_id } });
        if (getDeliveryAmount.length == 0) {
            return { status: false, code: 404, type: 'NotFound', message: 'delivery_amount_id NotFound', data: req.body.delivery_id };
        }
    }
    logger_1.default.info("savecallcenterorder: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.savecallcenterorder = savecallcenterorder;
//# sourceMappingURL=orderValidator.js.map