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
exports.brandController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const brandValidator_1 = require("../validators/brandValidator");
class brandController {
    brandData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield brandValidator_1.brandData(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { brand_name } = req.body;
                let response = yield database_1.BrandTable.findOne({
                    where: { brand_name }
                });
                // let response = await brandfindOne({where: { brand_name } })
                if (!response) {
                    response = yield database_1.BrandTable.create(req.body);
                    // let response = await brandcreate(<any>req.body)
                    return response_1.success(res, response);
                }
                next({ message: 'Already brand name exists' });
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while creating brand', body: err });
            }
        });
    }
    tabledata(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield brandValidator_1.createTransactions(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.transactionTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while creating brand', body: err });
            }
        });
    }
    returnTableData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let branch_id = req.query.branch_id;
                const response = yield database_1.transactionTable.findAll({
                    where: { branch_id: branch_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while creating brand', body: err });
            }
        });
    }
    updateTableData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield brandValidator_1.updateTransaction(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.transactionTable.update(req.body, {
                    where: { branch_id: req.body.branch_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while creating brand', body: err });
            }
        });
    }
    updateBrandData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { brand_id } = req.body;
            try {
                /** input validations */
                let validation = yield brandValidator_1.updateBrandData(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                // let filteredArray: any;
                // filteredArray = await OrderTable.findAll({
                //   attributes: ["brand_id"],
                //   where: { brand_id: brand_id }
                // });
                // if (filteredArray.length > 0) {
                //   return next({
                //     status: false,
                //     message: "Order already taken for this brand",
                //     body: []
                //   });
                // }
                const response = yield database_1.BrandTable.update(req.body, {
                    where: { brand_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while updating brand', body: err });
            }
        });
    }
    returnBrandData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                let response;
                id
                    ? (response = yield database_1.BrandTable.findAll({
                        where: { brand_id: id }
                    }))
                    : (response = yield database_1.BrandTable.findAll({ order: [['updatedAt', 'DESC']] }));
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while retrieving brand', body: err });
            }
        });
    }
    deleteBrandData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield brandValidator_1.deleteBrandData(req.query);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { id } = req.query;
                let filteredArray;
                filteredArray = yield database_1.OrderTable.findAll({
                    attributes: ['brand_id'],
                    where: { brand_id: id }
                });
                if (filteredArray.length > 0) {
                    return next({ status: false, message: 'Order already taken for this brand', body: [] });
                }
                const response = yield database_1.BrandTable.destroy({
                    where: { brand_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while deleting brand', body: err.message });
            }
        });
    }
    brandBranchData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let response;
                response = yield database_1.BranchTable.findAll({
                    raw: true,
                    where: { brand_id: id, branch_status: true }
                });
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.brandController = brandController;
//# sourceMappingURL=brandController.js.map