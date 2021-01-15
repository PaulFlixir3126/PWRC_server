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
exports.refundController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const refundValidator_1 = require("../validators/refundValidator");
class refundController {
    refundData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield refundValidator_1.refundDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.RefundTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while refunding',
                    body: err.message
                });
            }
        });
    }
    returnRefundData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                if (req.query.refund_status) {
                    let { order_id, refund_status } = req.query;
                    response = yield database_1.RefundTable.findAll({
                        where: database_1.Sequelize.and({ refund_status, order_id })
                    });
                    return response_1.success(res, response.reverse());
                }
                else {
                    response = yield database_1.RefundTable.findAll();
                    return response_1.success(res, response);
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occured while retrieving the refund details',
                    body: err
                });
            }
        });
    }
}
exports.refundController = refundController;
//# sourceMappingURL=refundController.js.map