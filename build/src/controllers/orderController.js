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
exports.orderController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const orderValidator_1 = require("../validators/orderValidator");
class orderController {
    orderData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield orderValidator_1.orderDataPost(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let obj = { receipt_manual_id: 0 };
                let newBody = Object.assign(Object.assign({}, req.body), obj);
                let { transaction_date, branch_id } = newBody;
                if (transaction_date == null || transaction_date == '' || transaction_date == undefined) {
                    return next({
                        status: false,
                        message: 'Some error occurred while creating order'
                    });
                }
                let receiptResponse = yield database_1.OrderTable.findAll({
                    where: database_1.sequelize.and({ transaction_date, branch_id }),
                    raw: true
                });
                if (receiptResponse.length > 0) {
                    receiptResponse.sort((a, b) => +b.order_id - +a.order_id);
                    let manual_id = receiptResponse[0].receipt_manual_id;
                    newBody.receipt_manual_id = manual_id + 1;
                }
                else {
                    newBody.receipt_manual_id = 1;
                }
                if (req.body.customer_id == 0 || req.body.customer_id == null) {
                    delete newBody.customer_id;
                }
                // let checkRecipt: any = await OrderTable.findAll({
                // 	where: {transaction_date, branch_id, receipt_manual_id:newBody.receipt_manual_id},
                // 	raw: true
                // });
                // if(checkRecipt.length > 0){
                // 	let obj = { status: false, type:'invalidRequest', message: 'order id already exist', data: {transaction_date, branch_id, receipt_manual_id:4} };
                // 	return res.status(400).send(obj);
                // }
                const response = yield database_1.OrderTable.create(newBody);
                let updatesOrderRes = JSON.parse(JSON.stringify(response));
                updatesalescount(updatesOrderRes);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while creating order',
                    body: err
                });
            }
        });
    }
    orderDataById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let response = yield database_1.OrderTable.findAll({
                    raw: true,
                    where: { order_id: id }
                });
                response.sort((a, b) => +a.order_id - +b.order_id);
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving order data',
                    body: err
                });
            }
        });
    }
    returnOrderData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, id, role, branch_id, verbose, transaction_date } = req.query;
                if (req.query.check == 'true') {
                    let response = yield database_1.OrderTable.findAll({
                        raw: true,
                        where: { user_id: id },
                    });
                    return response_1.success(res, response);
                }
                if (role === 'manager') {
                    if (status != 'false') {
                        let response = yield database_1.OrderTable.findAll({
                            raw: true,
                            where: { status: status, branch_id: branch_id, transaction_date: transaction_date }
                        });
                        response.sort((a, b) => +a.order_id - +b.order_id);
                        return response_1.success(res, response.reverse());
                    }
                    let response;
                    response = yield database_1.OrderTable.findAll({
                        where: { branch_id: branch_id, transaction_date: transaction_date },
                        raw: true
                    });
                    response.sort((a, b) => +a.order_id - +b.order_id);
                    return response_1.success(res, response.reverse());
                }
                if (role === 'cashier') {
                    let filter_array = [];
                    let response;
                    if (status === 'WaiterEncashed') {
                        response = yield database_1.sequelize.query(`SELECT COUNT(*),user_id,user_name,user_role,status,branch_id,SUM (net_cost) AS total FROM orders WHERE status='${status}'AND branch_id=${branch_id} AND transaction_date='${transaction_date}' GROUP BY user_name,status,branch_id,user_role,user_id`);
                        response[0].sort((a, b) => +a.order_id - +b.order_id);
                        return response_1.success(res, response[0]);
                    }
                    if (status != 'false') {
                        response = yield database_1.sequelize.query(`SELECT * from orders WHERE user_id='${id}'AND branch_id=${branch_id} AND transaction_date='${transaction_date}'AND status='${status}'`);
                        response[0].sort((a, b) => +a.order_id - +b.order_id);
                        return response_1.success(res, response[0].reverse());
                    }
                    response = yield database_1.sequelize.query(`SELECT * from orders WHERE branch_id=${branch_id} AND transaction_date='${transaction_date}' AND status !='CashCollected' AND status !='WaiterEncashed'`);
                    response[0].sort((a, b) => +a.order_id - +b.order_id);
                    filter_array = response[0].filter((r) => {
                        return r.user_role == 'waiter' || r.user_id == `${id}`;
                    });
                    return response_1.success(res, filter_array.reverse());
                }
                if (role === 'waiter') {
                    let response;
                    if (verbose == 'true') {
                        response = yield database_1.OrderTable.findAll({
                            where: {
                                status: status,
                                user_id: id,
                                branch_id: branch_id,
                                transaction_date: transaction_date
                            }
                        });
                        let response1 = yield database_1.sequelize.query(`SELECT user_name,SUM (net_cost) AS total_net,SUM (card_amount) AS total_card,SUM (cash_amount) AS total_cash FROM orders WHERE user_id='${id}' AND status='${status}' AND transaction_date='${transaction_date}'AND branch_id=${branch_id} GROUP BY user_name`);
                        let transaction = {
                            data: response.reverse(),
                            total_net: response1[0]
                        };
                        return response_1.success(res, transaction);
                    }
                    if (status != 'false') {
                        response = yield database_1.OrderTable.findAll({
                            where: {
                                status: status,
                                user_id: id,
                                branch_id: branch_id,
                                transaction_date: transaction_date
                            }
                        });
                        response.sort((a, b) => +a.order_id - +b.order_id);
                        return response_1.success(res, response.reverse());
                    }
                    response = yield database_1.sequelize.query(`SELECT * from orders WHERE branch_id=${branch_id} AND transaction_date='${transaction_date}'AND user_id='${id}' AND status !='Encashed' AND status!='CashCollected'`);
                    response[0].sort((a, b) => +a.order_id - +b.order_id);
                    return response_1.success(res, response[0].reverse());
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving order data',
                    body: err.message
                });
            }
        });
    }
    deleteOrderData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                let response;
                id
                    ? (response = yield database_1.OrderTable.destroy({
                        where: { order_id: id }
                    }))
                    : (response = yield database_1.OrderTable.destroy({
                        where: {},
                        truncate: true
                    }));
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    updateOrderData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield orderValidator_1.updateOrderData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let { order_id } = req.body;
                if (req.body.customer_id == 0 || req.body.customer_id == null) {
                    delete req.body.customer_id;
                }
                let response = yield database_1.OrderTable.update(req.body, {
                    where: { order_id: order_id },
                    returning: true
                });
                let updatesOrderRes = JSON.parse(JSON.stringify(response));
                updatesalescount(updatesOrderRes[1][0]);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating order data',
                    body: err
                });
            }
        });
    }
    waiterStatusUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.OrderTable.update({
                    status: req.body.status,
                    cashier_name: req.body.cashier_name,
                    end_shift_id: req.body.end_shift_id
                }, {
                    where: {
                        user_id: req.body.user_id,
                        status: 'WaiterEncashed',
                        branch_id: req.body.branch_id
                    },
                    returning: true
                });
                response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    message: 'Some error occurred while updating waiter status!',
                    body: err
                });
            }
        });
    }
    usersDetailsUppdateInAllOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield database_1.OrderTable.update(req.body, {
                    where: { user_id: req.body.user_id },
                    returning: true
                });
                let responselastupdatedby = yield database_1.OrderTable.update(req.body, {
                    where: { last_updated_by_id: req.body.last_updated_by_id },
                    returning: true
                });
                return response_1.success(res, { response, responselastupdatedby });
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
    driverAssignPOSOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield orderValidator_1.driverAssignPOSOrder(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let { order_id } = req.body;
                let response = yield database_1.OrderTable.update(req.body, {
                    where: { order_id: order_id, callcenterorder: false, segment_key: req.body.segment_key },
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
}
exports.orderController = orderController;
function updatesalescount(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < data.order_details.length; i++) {
            if ((data.status == 'WaiterEncashed') || (data.status == 'Encashed')) {
                let checkMenuOrder = yield database_1.salesCountTable.findAll({
                    where: {
                        menu_id: data.order_details[i].menu_id,
                        order_id: data.order_id,
                        brand_id: data.brand_id,
                        branch_id: data.branch_id,
                    }
                });
                let checkMenuOrder1 = JSON.parse(JSON.stringify(checkMenuOrder));
                if (checkMenuOrder1.length == 0) {
                    let package_type = '';
                    if (data.segment_key == 'take_out') {
                        package_type = 'Yes';
                    }
                    else if (data.segment_key == 'dine_in') {
                        package_type = 'No';
                    }
                    else {
                        package_type = data.segment_key;
                    }
                    let obj = {
                        menu_id: data.order_details[i].menu_id,
                        menu_name: data.order_details[i].menu_name,
                        order_id: data.order_id,
                        brand_id: data.brand_id,
                        branch_id: data.branch_id,
                        quantity: data.order_details[i].quantity,
                        status: data.status,
                        segment: data.segment_key,
                        package_type: package_type,
                        transaction_date: data.transaction_date,
                        end_shift_id: data.end_shift_id,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                    };
                    const salescountcreate = yield database_1.salesCountTable.create(obj, { returning: true });
                }
            }
        }
    });
}
//# sourceMappingURL=orderController.js.map