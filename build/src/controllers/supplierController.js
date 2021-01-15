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
exports.supplierController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class supplierController {
    supplierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { brand_id, supplier_name_english } = req.body;
                let response = yield database_1.SupplierTable.findOne({
                    where: { brand_id: brand_id, supplier_name_english: supplier_name_english },
                    raw: true
                });
                if (response) {
                    return next({ message: 'Duplicate supplier name' });
                }
                response = yield database_1.SupplierTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while configuration',
                    body: err
                });
            }
        });
    }
    returnSupplierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let response;
                if (id) {
                    response = yield database_1.SupplierTable.findAll({
                        where: { brand_id: id },
                        raw: true
                    });
                    return response_1.success(res, response.reverse());
                }
                response = yield database_1.SupplierTable.findAll({
                    include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }]
                });
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: err
                });
            }
        });
    }
    updateSupplierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.SupplierTable.update(req.body, {
                    where: { supplier_id: req.body.supplier_id },
                    returning: true
                });
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating configuration data',
                    body: err
                });
            }
        });
    }
    removeSupplierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { supplier_id, brand_id } = req.query;
                if (brand_id) {
                    const response = yield database_1.SupplierTable.destroy({
                        where: { brand_id: brand_id }
                    });
                    return response_1.success(res, response);
                }
                const response = yield database_1.SupplierTable.destroy({
                    where: { supplier_id: supplier_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.supplierController = supplierController;
//# sourceMappingURL=supplierController.js.map