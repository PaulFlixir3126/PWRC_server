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
exports.discountController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const discountValidator_1 = require("../validators/discountValidator");
class discountController {
    discountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield discountValidator_1.discountDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { brand_id, brand_name, discount_name, discount_percentage, discount_price, discount_type } = req.body;
                let response = yield database_1.DiscountTable.findOne({
                    where: database_1.Sequelize.and({ brand_id, discount_name })
                });
                if (!response) {
                    response = yield database_1.DiscountTable.create(req.body);
                    return response_1.success(res, response);
                }
                next({ message: 'Discount Name already exists' });
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while creating discount',
                    body: err
                });
            }
        });
    }
    returnDiscountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.query;
                let response;
                id
                    ? (response = yield database_1.DiscountTable.findAll({
                        where: { brand_id: id, discount_status: status },
                        include: [database_1.BrandTable]
                    }))
                    : (response = yield database_1.DiscountTable.findAll({ include: [database_1.BrandTable] }));
                response.sort((a, b) => +a.brand_id - +b.brand_id);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving discount data',
                    body: err.message
                });
            }
        });
    }
    deleteDiscountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                let response;
                let filteredArray;
                filteredArray = yield database_1.OrderTable.findAll({
                    attributes: ['order_id'],
                    where: { discount_id: id }
                });
                if (filteredArray.length > 0) {
                    return next({ status: false, message: 'Discount already added to orders' });
                }
                id
                    ? (response = yield database_1.DiscountTable.destroy({
                        where: { discount_id: id }
                    }))
                    : (response = yield database_1.DiscountTable.destroy({
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
    updateDiscountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield discountValidator_1.updateDiscountData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { brand_id, discount_name } = req.body;
                let response = yield database_1.DiscountTable.findOne({
                    where: database_1.Sequelize.and({ brand_id, discount_name })
                });
                if (!response) {
                    response = yield database_1.DiscountTable.update(req.body, {
                        where: {
                            discount_id: req.body.discount_id
                        }
                    });
                    return response_1.success(res, response);
                }
                next({ message: 'Discount Name already exists' });
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating discount',
                    body: err
                });
            }
        });
    }
}
exports.discountController = discountController;
//# sourceMappingURL=discountController.js.map