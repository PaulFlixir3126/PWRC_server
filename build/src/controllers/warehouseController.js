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
exports.warhouseController = void 0;
const database_1 = require("../db/database");
const warehouseValidator_1 = require("../validators/warehouseValidator");
const response_1 = require("../lib/response");
class warhouseController {
    addWarehouse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield warehouseValidator_1.addWarehouse(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let response = yield database_1.warehouse.create(req.body, { returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while saving warehouse details",
                    body: error.message
                });
            }
        });
    }
    getWarehouses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                if (parseInt(query.filterByBrand)) {
                    if ((query.brand_id == undefined) || (query.brand_id == null) || (query.brand_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass brand_id', data: {} });
                    }
                    wherequery.brand_id = query.brand_id;
                }
                if (query.fromdate && query.todate) {
                    wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                }
                let response = yield database_1.warehouse.findAndCountAll({
                    where: wherequery,
                    include: [{ model: database_1.BrandTable },
                    ],
                    order: [['updatedAt', 'DESC']],
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while getting warehouse',
                    body: err.message
                });
            }
        });
    }
    updateWarehouse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield warehouseValidator_1.updateWarehouse(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let response;
                response = yield database_1.warehouse.update(req.body, {
                    where: { warehouse_id: req.body.warehouse_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: 'Some error occurred while updating warehouse',
                    body: err.message
                });
            }
        });
    }
}
exports.warhouseController = warhouseController;
//# sourceMappingURL=warehouseController.js.map