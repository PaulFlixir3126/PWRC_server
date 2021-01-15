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
Object.defineProperty(exports, "__esModule", { value: true });
exports.callcenterController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const tokenVerify_1 = require("../lib/tokenVerify");
const orderValidator_1 = require("../validators/orderValidator");
class callcenterController {
    savecallcenterorder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield orderValidator_1.savecallcenterorder(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let response;
                req.body.callcenterorder = true;
                let { transaction_date, branch_id } = req.body;
                let receiptResponse = yield database_1.OrderTable.findAll({
                    where: database_1.sequelize.and({ transaction_date, branch_id }),
                    raw: true
                });
                if (receiptResponse.length > 0) {
                    receiptResponse.sort((a, b) => +b.order_id - +a.order_id);
                    let manual_id = receiptResponse[0].receipt_manual_id;
                    req.body.receipt_manual_id = manual_id + 1;
                }
                else {
                    req.body.receipt_manual_id = 1;
                }
                var splitcolon = req.body.talktime.split(':');
                if (splitcolon.length <= 2) {
                    `00:${req.body.talktime}`;
                }
                else { }
                req.body.talktime_in_sec = req.body.talktime.split(':').reduce((acc, time) => (60 * acc) + +time);
                if (req.body.timed_order) {
                    req.body.is_timed_order = true;
                }
                response = yield database_1.OrderTable.create(req.body, { returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while adding ccorder ",
                    body: error.message
                });
            }
        });
    }
    getcallcenterorder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                /** input validations */
                let validation = yield orderValidator_1.getcallcenterorder(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                if (parseInt(query.filterbyorder)) {
                    if ((query.order_id == undefined) || (query.order_id == null) || (query.order_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass order_id', data: {} });
                    }
                    wherequery.order_id = query.order_id;
                }
                if (parseInt(query.filterbybranch)) {
                    if ((query.branch_id == undefined) || (query.branch_id == null) || (query.branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass branch_id', data: {} });
                    }
                    wherequery.branch_id = query.branch_id;
                }
                if (parseInt(query.filterbybrand)) {
                    if ((query.brand_id == undefined) || (query.brand_id == null) || (query.brand_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass brand_id', data: {} });
                    }
                    wherequery.brand_id = query.brand_id;
                }
                if (parseInt(query.filterbycustomer)) {
                    if ((query.customer_id == undefined) || (query.customer_id == null) || (query.customer_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass customer_id', data: {} });
                    }
                    let arr = query.customer_id.split(',');
                    wherequery.customer_id = arr;
                }
                if (parseInt(query.filterbystatus)) {
                    if ((query.status == undefined) || (query.status == null) || (query.status == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass status', data: {} });
                    }
                    let statusarr = query.status.split(',');
                    wherequery.status = statusarr;
                }
                if (parseInt(query.filterbysegment)) {
                    if ((query.segment == undefined) || (query.segment == null) || (query.segment == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass segment', data: {} });
                    }
                    wherequery.segment_key = query.segment;
                }
                if (parseInt(query.filterbyuser)) {
                    if ((query.user_id == undefined) || (query.user_id == null) || (query.user_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass user_id', data: {} });
                    }
                    wherequery.user_id = query.user_id;
                }
                if (parseInt(query.filterbydriver)) {
                    if ((query.driver_id == undefined) || (query.driver_id == null) || (query.driver_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass driver_id', data: {} });
                    }
                    wherequery.driver_id = query.driver_id;
                }
                if (parseInt(query.filterbyrole)) {
                    if ((query.role == undefined) || (query.role == null) || (query.role == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass role', data: {} });
                    }
                    wherequery.role = query.role;
                }
                if (query.fromdate && query.todate) {
                    if ((query.fromdate == undefined) || (query.fromdate == null) || (query.fromdate == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass fromdate', data: {} });
                    }
                    if ((query.todate == undefined) || (query.todate == null) || (query.todate == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass todate', data: {} });
                    }
                    wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                }
                if (query.cc_transaction_date) {
                    if ((query.cc_transaction_date == undefined) || (query.cc_transaction_date == null) || (query.cc_transaction_date == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass cc_transaction_date', data: {} });
                    }
                    wherequery['cc_transaction_date'] = query.cc_transaction_date;
                }
                if (query.transaction_date) {
                    if ((query.transaction_date == undefined) || (query.transaction_date == null) || (query.transaction_date == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass transaction_date', data: {} });
                    }
                    wherequery['transaction_date'] = query.transaction_date;
                }
                let sort = [];
                if (query.sortBy == 'customer_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.CustomerTable, 'customer_name', query.sortType];
                }
                if (query.sortBy == 'customer_phone' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.CustomerTable, 'phone_no', query.sortType];
                }
                if (query.sortBy == 'order_createdAt' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['createdAt', query.sortType];
                }
                if (query.sortBy == 'order_updatedAt' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['updatedAt', query.sortType];
                }
                if (query.sortBy == 'order_id' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['order_id', query.sortType];
                }
                if (query.sortBy == 'brand_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.BranchTable, database_1.BrandTable, 'brand_name', query.sortType];
                }
                if (query.sortBy == 'branch_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.BranchTable, 'branch_name', query.sortType];
                }
                if (query.sortBy == 'status' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['status', query.sortType];
                }
                if (query.sortBy == 'talktime' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['talktime', query.sortType];
                }
                if (query.sortBy == 'net_cost' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['net_cost', query.sortType];
                }
                if (query.sortBy == 'total_cost' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['total_cost', query.sortType];
                }
                if (query.sortBy == 'segment_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['segment_name', query.sortType];
                }
                if (query.sortBy == 'driver_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['driver_name', query.sortType];
                }
                if (!query.sortBy || !query.sortType) {
                    sort = ['updatedAt', 'DESC'];
                }
                wherequery.callcenterorder = true;
                console.log("wherequery cc", wherequery);
                console.log("sortBy", query.sortBy, "sortType", query.sortType, "sort", sort);
                let response = yield database_1.OrderTable.findAndCountAll({
                    where: wherequery,
                    include: [{ model: database_1.CustomerTable },
                        { model: database_1.CustomerAddressTable, include: [{ model: database_1.GlobalAreaTable }, { model: database_1.BlockTable }] },
                        { model: database_1.BranchTable, attributes: ["branch_name", "branch_name_arabic", 'branch_id'],
                            include: [{ model: database_1.BrandTable, attributes: ['brand_name', 'brand_name_arabic', 'brand_id'] }] },
                        { model: database_1.DeliveryTable, include: [{ model: database_1.GlobalAreaTable }] },
                        { model: database_1.DeliveryAmountTable },
                        { model: database_1.OnlineTypeTable },
                        { model: database_1.OnlineSourcePaymentTypeTable }
                    ],
                    limit: query.limit,
                    offset: query.offset,
                    order: [sort],
                });
                return response_1.success(res, response);
            }
            catch (error) {
                console.log("eeeeee", error);
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    searchcallcenterorder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                /** input validations */
                let validation = yield orderValidator_1.getcallcenterorder(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                if (parseInt(query.filterbyorder)) {
                    if ((query.order_id == undefined) || (query.order_id == null) || (query.order_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass order_id', data: {} });
                    }
                    wherequery.order_id = query.order_id;
                }
                if (parseInt(query.filterbybranch)) {
                    if ((query.branch_id == undefined) || (query.branch_id == null) || (query.branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass branch_id', data: {} });
                    }
                    wherequery.branch_id = query.branch_id;
                }
                if (parseInt(query.filterbybrand)) {
                    if ((query.brand_id == undefined) || (query.brand_id == null) || (query.brand_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass brand_id', data: {} });
                    }
                    wherequery.brand_id = query.brand_id;
                }
                if (parseInt(query.filterbycustomer)) {
                    if ((query.customer_id == undefined) || (query.customer_id == null) || (query.customer_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass customer_id', data: {} });
                    }
                    let arr = query.customer_id.split(',');
                    wherequery.customer_id = arr;
                }
                if (parseInt(query.filterbystatus)) {
                    if ((query.status == undefined) || (query.status == null) || (query.status == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass status', data: {} });
                    }
                    let statusarr = query.status.split(',');
                    wherequery.status = statusarr;
                }
                if (parseInt(query.filterbysegment)) {
                    if ((query.segment == undefined) || (query.segment == null) || (query.segment == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass segment', data: {} });
                    }
                    wherequery.segment_key = query.segment;
                }
                if (parseInt(query.filterbyuser)) {
                    if ((query.user_id == undefined) || (query.user_id == null) || (query.user_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass user_id', data: {} });
                    }
                    wherequery.user_id = query.user_id;
                }
                if (parseInt(query.filterbydriver)) {
                    if ((query.driver_id == undefined) || (query.driver_id == null) || (query.driver_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass driver_id', data: {} });
                    }
                    wherequery.driver_id = query.driver_id;
                }
                if (parseInt(query.filterbyrole)) {
                    if ((query.role == undefined) || (query.role == null) || (query.role == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass role', data: {} });
                    }
                    wherequery.role = query.role;
                }
                if (query.fromdate && query.todate) {
                    if ((query.fromdate == undefined) || (query.fromdate == null) || (query.fromdate == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass fromdate', data: {} });
                    }
                    if ((query.todate == undefined) || (query.todate == null) || (query.todate == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass todate', data: {} });
                    }
                    wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                }
                if (query.cc_transaction_date) {
                    if ((query.cc_transaction_date == undefined) || (query.cc_transaction_date == null) || (query.cc_transaction_date == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass cc_transaction_date', data: {} });
                    }
                    wherequery['cc_transaction_date'] = query.cc_transaction_date;
                }
                if (query.transaction_date) {
                    if ((query.transaction_date == undefined) || (query.transaction_date == null) || (query.transaction_date == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass transaction_date', data: {} });
                    }
                    wherequery['transaction_date'] = query.transaction_date;
                }
                let sort = [];
                if (query.sortBy == 'customer_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.CustomerTable, 'customer_name', query.sortType];
                }
                if (query.sortBy == 'customer_phone' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.CustomerTable, 'phone_no', query.sortType];
                }
                if (query.sortBy == 'order_createdAt' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['createdAt', query.sortType];
                }
                if (query.sortBy == 'order_updatedAt' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['updatedAt', query.sortType];
                }
                if (query.sortBy == 'order_id' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['order_id', query.sortType];
                }
                if (query.sortBy == 'brand_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.BranchTable, database_1.BrandTable, 'brand_name', query.sortType];
                }
                if (query.sortBy == 'branch_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.BranchTable, 'branch_name', query.sortType];
                }
                if (query.sortBy == 'status' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['status', query.sortType];
                }
                if (query.sortBy == 'talktime' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['talktime', query.sortType];
                }
                if (query.sortBy == 'net_cost' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['net_cost', query.sortType];
                }
                if (query.sortBy == 'total_cost' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['total_cost', query.sortType];
                }
                if (query.sortBy == 'segment_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['segment_name', query.sortType];
                }
                if (query.sortBy == 'driver_name' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = ['driver_name', query.sortType];
                }
                if (!query.sortBy || !query.sortType) {
                    sort = ['updatedAt', 'DESC'];
                }
                wherequery.callcenterorder = true;
                console.log("wherequery cc", wherequery);
                console.log("sortBy", query.sortBy, "sortType", query.sortType, "sort", sort);
                let response = yield database_1.OrderTable.findAndCountAll({
                    where: wherequery,
                    include: [{ model: database_1.CustomerTable },
                        { model: database_1.CustomerAddressTable, include: [{ model: database_1.GlobalAreaTable }, { model: database_1.BlockTable }] },
                        { model: database_1.BranchTable, attributes: ["branch_name", "branch_name_arabic", 'branch_id'],
                            include: [{ model: database_1.BrandTable, attributes: ['brand_name', 'brand_name_arabic', 'brand_id'] }] },
                        { model: database_1.DeliveryTable, include: [{ model: database_1.GlobalAreaTable }] },
                        { model: database_1.DeliveryAmountTable },
                        { model: database_1.OnlineTypeTable },
                        { model: database_1.OnlineSourcePaymentTypeTable }
                    ],
                    // limit : query.limit,
                    // offset: query.offset,
                    order: [sort],
                });
                return response_1.success(res, response);
            }
            catch (error) {
                console.log("eeeeee", error);
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    updatecallcenterOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield orderValidator_1.updateOrderData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let { order_id } = req.body;
                let response = yield database_1.OrderTable.update(req.body, {
                    where: { order_id: order_id, callcenterorder: true },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while updating order data',
                    body: err.message
                });
            }
        });
    }
    driverAssign(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield orderValidator_1.driverassign(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let { order_id } = req.body;
                let response = yield database_1.OrderTable.update(req.body, {
                    where: { order_id: order_id, callcenterorder: true },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while updating order data',
                    body: err.message
                });
            }
        });
    }
    driverReAssign(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield orderValidator_1.driverReAssign(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                req.body['status'] = 'driver_assigned';
                let response = yield database_1.OrderTable.update(req.body, {
                    where: {
                        callcenterorder: true,
                        driver_id: req.body.old_driver_id,
                        status: {
                            [database_1.Op.or]: ['driver_assigned', 'driver_out']
                        }
                    },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while updating order data',
                    body: err.message
                });
            }
        });
    }
    orderTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield orderValidator_1.transferorder(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let { order_id } = req.body;
                let response = yield database_1.OrderTable.update(req.body, {
                    where: { order_id: order_id, callcenterorder: true },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while transfer order data',
                    body: err.message
                });
            }
        });
    }
    callcenterDashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let wherequery = {};
                let query = req.query;
                let cancellOrder = yield database_1.OrderTable.count({ where: { status: 'Cancelled', callcenterorder: true } });
                let totalCCorder = yield database_1.OrderTable.count({ where: { callcenterorder: true } });
                let totalsales = yield database_1.sequelize.query(`select sum(net_cost) as net_sales from orders 
    where  (status='Saved') and callcenterorder=true`);
                let totalOnlineOrder = yield database_1.sequelize.query(` SELECT COUNT(*) FROM "orders"
    WHERE onlinetype_id IS NOT NULL 
    and onlinesource_payment_id IS NOT NULL 
    and callcenterorder=true`);
                let totalCC_delivery = yield database_1.OrderTable.count({ where: { callcenterorder: true, segment_key: 'cc_delivery' } });
                let totalCC_pickup = yield database_1.OrderTable.count({ where: { callcenterorder: true, segment_key: 'cc_pickup' } });
                let totalCC_driver_out = yield database_1.OrderTable.count({ where: { callcenterorder: true, status: 'driver_out' } });
                let totalCC_driver_in = yield database_1.OrderTable.count({ where: { callcenterorder: true, status: 'driver_in' } });
                let totalCC_Saved = yield database_1.OrderTable.count({ where: { callcenterorder: true, status: 'Saved' } });
                let obj = {
                    totalsales: totalsales[0],
                    totalOnlineOrder: totalOnlineOrder[0],
                    cancelledOrders: cancellOrder,
                    totalCallcenterOrders: totalCCorder,
                    total_CC_delivery_orders: totalCC_delivery,
                    total_CC_pickup_orders: totalCC_pickup,
                    total_CC_driver_out_orders: totalCC_driver_out,
                    total_CC_Saved_orders: totalCC_Saved,
                    total_CC_driver_in_orders: totalCC_driver_in
                };
                return response_1.success(res, obj);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while getting dashoard data',
                    body: error.message
                });
            }
        });
    }
    callcenterSearch(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let serachby = req.query.serachby;
                let keyword = req.query.keyword;
                let brand_id = req.query.brand_id;
                let branch_id = req.query.branch_id;
                let order_id = req.query.order_id;
                let callcenter = req.query.callcenter;
                let s = keyword + "%";
                let query = '';
                let response;
                if (serachby == 'order_id') {
                    if (brand_id && branch_id) {
                        query = `SELECT * FROM  orders WHERE brand_id= ${brand_id} and branch_id=${branch_id} and callcenterorder=${callcenter} and 
          order_id::text  LIKE '${s}' `;
                    }
                    query = `SELECT * FROM  orders WHERE  callcenterorder=${callcenter} and 
        order_id::text  LIKE '${s}' `;
                }
                response = yield database_1.sequelize.query(query);
                return response_1.success(res, response[0]);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while getting search data',
                    body: error.message
                });
            }
        });
    }
    callcenterSalesByHours(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                //  let wherequery:any ={createdAt: {
                //   [Op.gte]: query.fromdate,
                //   [Op.lte]: query.todate
                // }}
                wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                wherequery.callcenterorder = true;
                let salesBYHours = yield database_1.OrderTable.findAll({
                    where: wherequery,
                    attributes: [
                        [database_1.sequelize.fn('date_trunc', 'hour', database_1.sequelize.col('createdAt')), 'hour'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('total_cost')), 'totalSales'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'netSales']
                    ],
                    group: 'hour'
                });
                salesBYHours = JSON.parse(JSON.stringify(salesBYHours));
                salesBYHours.sort((a, b) => {
                    var dateA = new Date(a.day);
                    var dateB = new Date(b.day);
                    return dateA - dateB;
                });
                //  ` SELECT date_trunc('hour', "createdAt") AS "hour", sum("total_cost") AS "totalSales", sum("net_cost") AS "netSales"
                //   FROM "orders" AS "order" WHERE "order"."createdAt" BETWEEN '2020-08-25T00:00:00.000Z' AND '2020-08-25T23:59:59.059Z' 
                //   AND "order"."callcenterorder" = true GROUP BY "hour"; `
                return response_1.success(res, salesBYHours);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    callcenterSalesByDaily(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                wherequery.callcenterorder = true;
                let salesBYDay = yield database_1.OrderTable.findAll({
                    where: wherequery,
                    attributes: [
                        [database_1.sequelize.fn('date_trunc', 'day', database_1.sequelize.col('createdAt')), 'day'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('total_cost')), 'totalSales'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'netSales']
                    ],
                    group: 'day',
                });
                salesBYDay = JSON.parse(JSON.stringify(salesBYDay));
                salesBYDay.sort((a, b) => {
                    var dateA = new Date(a.day);
                    var dateB = new Date(b.day);
                    return dateA - dateB;
                });
                //  ` SELECT date_trunc('day', "createdAt") AS "day", sum("total_cost") AS "totalSales", sum("net_cost") AS "netSales" 
                //  FROM "orders" AS "order" WHERE "order"."createdAt" BETWEEN '2020-08-01T00:00:00.000Z' AND '2020-08-31T23:59:59.059Z' 
                //  AND "order"."callcenterorder" = true GROUP BY "day"; `
                return response_1.success(res, salesBYDay);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    callcenterUserPerformance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let query:any=req.query
                let role = req.query.role ? req.query.role : 'cc_agent';
                let query = `SELECT "user_name", 
      sum("total_cost") AS "totalSales", 
      sum("net_cost") AS "totalnetSales", 
      avg("net_cost") AS "avgnetSales", 
      avg("total_cost") AS "avgtotalSales", 
      avg("talktime_in_sec") AS "avgtalktime", 
      COUNT(*) filter (where status = 'Cancelled') as cancelled,
      COUNT(*) AS "totalorders" 
      FROM "orders" AS "order" 
      WHERE "order"."user_role" = '${role}' AND "order"."callcenterorder" = true 
      GROUP BY "user_name" `;
                let agentperformance = yield database_1.sequelize.query(query);
                return response_1.success(res, agentperformance[0]);
                //   let wherequery:any={}
                //   if(req.query.fromdate && req.query.todate){
                //     wherequery['createdAt']={[Op.between]: [query.fromdate, query.todate]}
                //   }
                //   if(req.query.role){
                //     wherequery['user_role']=req.query.role
                //   }
                // wherequery.callcenterorder=true
                //     let agentperformance:any = await OrderTable.findAll({
                //       where: wherequery,
                //       attributes: [
                //         'user_name',
                //         [ sequelize.fn('sum', sequelize.col('total_cost')), 'totalSales'],
                //         [ sequelize.fn('sum', sequelize.col('net_cost')), 'total_netSales'],
                //         [ sequelize.fn('avg', sequelize.col('net_cost')), 'avg_netSales'],
                //         [ sequelize.fn('avg', sequelize.col('total_cost')), 'avg_totalSales'],
                //         [ sequelize.fn('avg', sequelize.col('talktime_in_sec')), 'avg_talktime'],
                //         // [ Sequelize.fn('count', 'user_name'), 'count'],
                //         [Sequelize.literal(`COUNT(*)`), 'total_order'],
                //         // [Sequelize.literal(`select user_name,COUNT(*) filter (where status = 'Cancelled') as cancelled from "orders" group by user_name`), 'countso'],
                //       ],
                //       group: 'user_name'
                //     });
                //     wherequery.status='Cancelled'
                //     let usersCancellOrder:any = await OrderTable.findAll({
                //       where: wherequery,
                //       attributes: [
                //         'user_name',
                //         [ Sequelize.fn('count', 'user_name'), 'total_cancelled_Order']
                //                 ],
                //       group: 'user_name'
                //     });
                //     agentperformance =JSON.parse(JSON.stringify(agentperformance))
                //     usersCancellOrder =JSON.parse(JSON.stringify(usersCancellOrder))
                //     console.log("cancellcount",usersCancellOrder)
                //     console.log("agentperformance",agentperformance)
                //     for(let i=0; i<agentperformance.length; i++){
                //       for(let j=0; j<usersCancellOrder.length; j++){
                //             if(agentperformance[i].user_name == usersCancellOrder[j].user_name){
                //               agentperformance[i].total_cancelled_Order = usersCancellOrder[j].total_cancelled_Order
                //             }
                //       }
                //     }
                //sec to hh:mm:ss
                // var measuredTime = new Date(null);
                // measuredTime.setSeconds(3723); // specify value of SECONDS
                // var MHSTime = measuredTime.toISOString().substr(11, 8);
                // console.log("MHSTime",MHSTime)
                // return success(res, agentperformance);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    callcenterOrderAmountComarission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                wherequery.callcenterorder = true;
                let totalorders = yield database_1.OrderTable.findAll({
                    where: wherequery,
                    attributes: [
                        [database_1.Sequelize.literal(`COUNT(*)`), 'total_order'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('total_cost')), 'totalSales'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total_netSales'],
                    ],
                });
                return response_1.success(res, totalorders);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    callcenterOrdersummary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let totalccorderWithoutOnline:any = await OrderTable.findAll({
                //   where: {
                //     callcenterorder:true,
                //     onlinetype_id:{
                //       [Op.eq]: null
                //     },
                //   },
                //   attributes: [
                //       [Sequelize.literal(`COUNT(*)`), 'total_order'],
                //       [ sequelize.fn('sum', sequelize.col('total_cost')), 'totalSales'],
                //       [ sequelize.fn('sum', sequelize.col('net_cost')), 'total_netSales'],
                //     ],
                // });
                // totalccorderWithoutOnline =JSON.parse(JSON.stringify(totalccorderWithoutOnline))
                // let totalorders:any = await OrderTable.findAll({
                //   where: {
                //     callcenterorder:true,
                //     onlinetype_id:{
                //       [Op.ne]: null
                //     },
                //     onlinesource_payment_id:{
                //       [Op.ne]: null
                //     }
                //   },
                //   attributes: [
                //     'onlinetype_id',
                //     [Sequelize.literal(`COUNT(*)`), 'total_order'],
                //     [ sequelize.fn('sum', sequelize.col('total_cost')), 'totalSales'],
                //     [ sequelize.fn('sum', sequelize.col('net_cost')), 'total_netSales'],
                //   ],
                //   group:['onlinetype_id']
                // });
                // let getOnlineTypes:any = await OnlineTypeTable.findAll({ where: {} } );
                // totalorders =JSON.parse(JSON.stringify(totalorders))
                // getOnlineTypes =JSON.parse(JSON.stringify(getOnlineTypes))
                // for(let i=0; i<totalorders.length; i++){
                //   for(let j=0; j<getOnlineTypes.length; j++){
                //         if(totalorders[i].onlinetype_id == getOnlineTypes[j].onlinetype_id){
                //           totalorders[i].online_type_english = getOnlineTypes[j].online_type_english
                //           totalorders[i].online_type_arabic = getOnlineTypes[j].online_type_arabic
                //         }
                //   }
                // }
                // return success(res, {withOnline: totalorders, withoutOnline:totalccorderWithoutOnline});
                let withonlinequery = `SELECT Count(*) as totalOrder, sum(net_cost) as totalnet, 
        orders.onlinetype_id AS onlinetype_id, onlinetypes.online_type_english AS online_type_english,
        onlinetypes.online_type_arabic AS online_type_arabic
          FROM orders 
          LEFT JOIN onlinetypes ON orders.onlinetype_id = onlinetypes.onlinetype_id 
          WHERE orders.callcenterorder=true
          GROUP BY orders.onlinetype_id, onlinetypes.online_type_english,onlinetypes.online_type_arabic`;
                let totalorders = yield database_1.sequelize.query(withonlinequery);
                return response_1.success(res, totalorders[0]);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    callcenterBranchOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let auth = new tokenVerify_1.verifying();
                let getusers = yield auth.getUsers(req, res, next);
                console.log("getusers", getusers);
                if (!getusers.status) {
                    let obj = { status: false, message: getusers.message, data: getusers.data };
                    return res.status(500).send(obj);
                }
                let query2 = `SELECT Count(*) as totalOrder, 
      COUNT(*) filter (where status = 'Cancelled') as cancelled,
      COUNT(*) filter (where status = 'Saved') as pending, 
      orders.branch_id AS branch_id,orders.brand_id AS brand_id, 
	    branches.branch_name AS branch_name,
	    branches.branch_name_arabic as branch_name_arabic,
	    brands.brand_name AS brand_name,
	    brands.brand_name_arabic as brand_name_arabic
       
     FROM orders 
     LEFT JOIN branches ON orders.branch_id = branches.branch_id
	   LEFT JOIN brands ON orders.brand_id = brands.brand_id 
     WHERE orders.callcenterorder=true
     GROUP BY orders.branch_id,orders.brand_id, branches.branch_name,
	            branches.branch_name_arabic, brands.brand_name,brands.brand_name_arabic`;
                let totalorders = yield database_1.sequelize.query(query2);
                getusers.data = JSON.parse(getusers.data);
                let filterdriverRole = getusers.data.filter((ele) => {
                    return ele.role == 'driver';
                });
                // console.log("filterdriverRole",filterdriverRole)
                var counts = filterdriverRole.reduce((p, c) => {
                    var name = c.reference.branch_id;
                    if (!p.hasOwnProperty(name)) {
                        p[name] = 0;
                    }
                    p[name]++;
                    return p;
                }, {});
                // console.log(counts);
                var countsExtended = Object.keys(counts).map(k => {
                    return { branch_id: k, TotalDrivers: counts[k] };
                });
                // console.log(countsExtended);
                for (let i = 0; i < totalorders[0].length; i++) {
                    for (let j = 0; j < countsExtended.length; j++) {
                        if (totalorders[0][i].branch_id == countsExtended[j].branch_id) {
                            totalorders[0][i].TotalDrivers = countsExtended[j].TotalDrivers;
                        }
                    }
                }
                // let group = totalorders[0].reduce((r:any, a:any) => {
                //   console.log("a", a);
                //   console.log('r', r);
                //   r[a.brand_id] = [...r[a.brand_id] || [], a];
                //   return r;
                //  }, {});
                return response_1.success(res, totalorders[0]);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting cc orders ",
                    body: error.message
                });
            }
        });
    }
    callcenterCustomerReports(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let wherequery = {};
                //   let totalorders = await sequelize.query(`-- select count("order"."order_id") AS "count" FROM "orders" AS "order" 
                //   -- INNER JOIN "customercatalogs" AS "customercatalog" ON "order"."customer_id" = "customercatalog"."customer_id" 
                //   --     AND "customercatalog"."createdAt" 
                //   -- 	BETWEEN '2020-07-21T00:00:00.000Z' AND '2020-07-21T23:59:59.059Z' 
                //   -- 	LEFT OUTER JOIN 
                //   -- 	"globalareas" AS "customercatalog->globalarea" ON "customercatalog"."area_id" = "customercatalog->globalarea"."area_id" 
                //     SELECT Count(*) as totalOrder, 
                //         orders.customer_id AS customer_id, 
                //       customercatalogs.customer_name AS customer_name,
                //       customercatalogs
                //        FROM orders 
                //        LEFT JOIN customercatalogs ON orders.customer_id = customercatalogs.customer_id
                //        WHERE orders.callcenterorder=true AND 
                //      "customercatalogs"."createdAt" BETWEEN '2020-07-21T00:00:00.000Z' AND '2020-07-21T23:59:59.059Z' 
                //        GROUP BY orders.customer_id, customercatalogs.customer_name,customercatalogs
                //     `);
                //   `SELECT Count(*) as totalOrder, 
                //   orders.customer_id AS customer_id, 
                // customercatalogs.customer_name AS customer_name
                //  FROM orders 
                //  LEFT JOIN customercatalogs ON orders.customer_id = customercatalogs.customer_id
                //  WHERE orders.callcenterorder=true
                //  GROUP BY orders.customer_id, customercatalogs.customer_name
                // `
                return response_1.success(res, {});
            }
            catch (error) {
                console.log("eeee", error);
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while getting search data',
                    body: error.message
                });
            }
        });
    }
    savecallcenterTransactionDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                response = yield database_1.CCtransactionTable.create(req.body, { returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while adding ccTransactionDate ",
                    body: error.message
                });
            }
        });
    }
    getcallcenterTransactionDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                response = yield database_1.CCtransactionTable.findAll({
                    where: {},
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting ccTransactionDate ",
                    body: error.message
                });
            }
        });
    }
    updatecallcenterTransactionDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                response = yield database_1.CCtransactionTable.update(req.body, { where: { id: 1 }, returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while updating ccTransactionDate ",
                    body: error.message
                });
            }
        });
    }
}
exports.callcenterController = callcenterController;
//# sourceMappingURL=callcenterController.js.map