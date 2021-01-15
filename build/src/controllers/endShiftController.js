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
exports.endShift = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const queryBuilder_1 = require("../lib/queryBuilder");
const global_crud_1 = require("../lib/global-crud");
const endShiftValidator_1 = require("../validators/endShiftValidator");
const moment_1 = __importDefault(require("moment"));
const presentDay = {
    createdAt: {
        [database_1.Op.gte]: moment_1.default()
            .subtract(1, 'days')
            .toDate()
    }
};
const nextDay = {
    updatedAt: {
        [database_1.Op.gte]: moment_1.default()
            .subtract()
            .toDate()
    }
};
class endShift {
    shiftData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let query = queryBuilder_1.queryBuilder(req.query);
                response = yield database_1.OrderTable.findAll({
                    where: database_1.Sequelize.and(query),
                    raw: true
                });
                response = yield database_1.OrderTable.findAll({
                    where: database_1.Sequelize.and(query),
                    attributes: [
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('total_cost')), 'totalAmount'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'totalNetAmount'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('card_amount')), 'cardAmount'],
                        [database_1.sequelize.fn('sum', database_1.sequelize.col('discount_amount')), 'discountAmount'],
                        [database_1.sequelize.fn('count', database_1.sequelize.col('order_id')), 'totalSales']
                    ],
                    raw: true
                });
                let data = response.reverse();
                let orderStat = {
                    totalAmount: data[0].totalAmount || 0,
                    totalNetAmount: data[0].totalNetAmount || 0,
                    cardAmount: data[0].cardAmount || 0,
                    discountAmount: data[0].discountAmount || 0,
                    totalSales: parseInt(data[0].totalSales) || 0
                };
                delete req.query.status;
                query = yield queryBuilder_1.queryBuilder(req.query);
                let endShiftResponse = yield database_1.EndShiftTable.findAll({ where: database_1.Sequelize.and(query) });
                let sh = endShiftResponse[0];
                sh = JSON.stringify(sh);
                sh = JSON.parse(sh);
                sh = Object.assign(Object.assign({}, orderStat), sh);
                return response_1.success(res, [sh]);
            }
            catch (err) {
                next({
                    message: 'Some error occurred while retrieving endShift!',
                    body: err
                });
            }
        });
    }
    postData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield endShiftValidator_1.postData(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { cashier_name } = req.body, query = Object.assign(Object.assign({}, presentDay), { cashier_name }), get = yield global_crud_1.gReturn({ where: database_1.Sequelize.and(query) }, database_1.EndShiftTable, res, next, true);
                yield global_crud_1.gCreate(req.body, database_1.EndShiftTable, res, next);
            }
            catch (error) { }
        });
    }
    updateData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            /** input validations */
            let validation = yield endShiftValidator_1.updateData(req.body);
            if (!validation.status) {
                let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                return res.status(validation.code).send(obj);
            }
            global_crud_1.gUpdate(req.body, `end_shift_id`, database_1.EndShiftTable, res, next);
        });
    }
    endShiftData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                const response = yield database_1.EndShiftTable.findAll({ where: database_1.Sequelize.and(query) });
                response.sort((a, b) => +a.end_shift_id - +b.end_shift_id);
                response_1.success(res, response.reverse());
            }
            catch (error) {
                next({
                    message: 'Some error occurred while fetching endShift status!',
                    body: error
                });
            }
        });
    }
    startShiftData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                /** input validations */
                let validation = yield endShiftValidator_1.startShiftData(query);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                    // next({
                    // 	message: 'Some error occurred while fetching endShift status'
                    // });
                    // return;
                }
                query = queryBuilder_1.queryBuilder(req.query);
                let { brand_id, branch_id, cashier_id } = query;
                if (brand_id == 'undefined' ||
                    branch_id == 'undefined' ||
                    cashier_id == 'undefined' ||
                    brand_id == undefined ||
                    branch_id == undefined ||
                    cashier_id == undefined ||
                    brand_id == null ||
                    branch_id == null ||
                    cashier_id == null) {
                    next({
                        message: 'Some error occurred while fetching endShift status'
                    });
                    return;
                }
                const response = yield database_1.EndShiftTable.findAll({ where: database_1.Sequelize.and(query) });
                response.sort((a, b) => +a.end_shift_id - +b.end_shift_id);
                response_1.success(res, response.reverse());
            }
            catch (error) {
                console.log('eee', error);
                next({
                    message: 'Some error occurred while fetching endShift status!',
                    body: error
                });
            }
        });
    }
    statusUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.OrderTable.update({ status: req.body.status }, {
                    where: {
                        brand_id: req.body.brand_id,
                        branch_id: req.body.branch_id,
                        end_shift_id: req.body.end_shift_id,
                        status: 'Encashed'
                    },
                    returning: true
                });
                response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    message: 'Some error occurred while updating endShift status!',
                    body: err
                });
            }
        });
    }
}
exports.endShift = endShift;
//# sourceMappingURL=endShiftController.js.map