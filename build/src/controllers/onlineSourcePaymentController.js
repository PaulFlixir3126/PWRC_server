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
exports.OnlineSourcePaymentController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class OnlineSourcePaymentController {
    onlineSourcePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.OnlineSourcePaymentTypeTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while adding online source payments',
                    body: err.message
                });
            }
        });
    }
    getonlineSouncePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let where = {};
                //  if(query.orderby == 'brand'){
                //    where={brand_id:query.brand_id}
                //  }
                //  if(query.orderby == 'branch'){
                //   where={branch_id:query.branch_id}
                //  }
                if (query.orderby == 'onlinetype') {
                    where = { onlinetype_id: query.onlinetype_id };
                }
                if (query.orderby == 'onlinesourcepayment') {
                    where = { onlinesource_payment_id: query.onlinesource_payment_id };
                }
                let response = yield database_1.OnlineSourcePaymentTypeTable.findAll({
                    where: where,
                    include: [{ model: database_1.OnlineTypeTable }]
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while getting online source payments',
                    body: error.message
                });
            }
        });
    }
    updateonlineSouncePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { onlinesource_payment_id } = req.body;
                let response = yield database_1.OnlineSourcePaymentTypeTable.update(req.body, {
                    where: { onlinesource_payment_id: onlinesource_payment_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while updating online source payments',
                    body: err.message
                });
            }
        });
    }
    deleteonlineSouncePayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let onlinesource_payment_id = req.query.onlinesource_payment_id;
                const response = yield database_1.OnlineSourcePaymentTypeTable.destroy({
                    where: { onlinesource_payment_id: onlinesource_payment_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while deleting online source payments",
                    body: err.message
                });
            }
        });
    }
}
exports.OnlineSourcePaymentController = OnlineSourcePaymentController;
//# sourceMappingURL=onlineSourcePaymentController.js.map