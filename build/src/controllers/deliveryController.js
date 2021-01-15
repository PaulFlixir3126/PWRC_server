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
exports.deliveryController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const deliveryValidator_1 = require("../validators/deliveryValidator");
class deliveryController {
    deliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield deliveryValidator_1.deliveryDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.DeliveryTable.bulkCreate(req.body, { returning: true });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while creating delivery configuration',
                    body: err.message
                });
            }
        });
    }
    returnDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { branch_id, status, raw, id, area_id, brand_id } = req.query;
                if (id && raw) {
                    branch_id = id;
                    status = raw;
                }
                let response;
                if (status && branch_id) {
                    response = yield database_1.DeliveryTable.findAll({
                        where: { branch_id: branch_id, status: status },
                        include: [
                            { model: database_1.GlobalAreaTable, attributes: ["area_id", "area_name_english", "area_name_arabic"],
                                include: [{ model: database_1.BlockTable, attributes: ["area_id", "block_id", "block"] }]
                            },
                            { model: database_1.BranchTable, attributes: ['branch_id', 'branch_name', 'branch_name_arabic', 'brand_id'] },
                            { model: database_1.BrandTable, attributes: ['brand_id', 'brand_name', 'brand_name_arabic'] }
                        ]
                    });
                    let deliveryResponse = yield database_1.DeliveryAmountTable.findAll({
                        where: { branch_id: branch_id }
                    });
                    let deliveryData = JSON.parse(JSON.stringify(deliveryResponse));
                    let areaResponse = JSON.parse(JSON.stringify(response));
                    deliveryData.map((r) => {
                        areaResponse.map((e) => {
                            if (e.locality == true) {
                                e.delivery_amount = r.local_amount;
                            }
                            else {
                                e.dlivery_amount = r.non_local_amount;
                            }
                        });
                    });
                    return response_1.success(res, areaResponse);
                }
                if (branch_id || area_id || brand_id) {
                    let wherequery = {};
                    if (req.query.area_id) {
                        wherequery.area_id = req.query.area_id;
                    }
                    if (req.query.status) {
                        wherequery.status = status;
                    }
                    if (req.query.branch_id) {
                        wherequery.branch_id = branch_id;
                    }
                    if (req.query.brand_id) {
                        wherequery.brand_id = brand_id;
                    }
                    // wherequery.branch_id=branch_id
                    response = yield database_1.DeliveryTable.findAll({
                        where: wherequery,
                        include: [
                            { model: database_1.GlobalAreaTable, attributes: ["area_id", "area_name_english", "area_name_arabic"],
                                include: [{ model: database_1.BlockTable, attributes: ["area_id", "block_id", "block"] }] },
                            { model: database_1.BranchTable, attributes: ['branch_id', 'branch_name', 'branch_name_arabic', 'brand_id'] },
                            { model: database_1.BrandTable, attributes: ['brand_id', 'brand_name', 'brand_name_arabic'] }
                        ]
                    });
                    return response_1.success(res, response);
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching delivery configuration data',
                    body: err.message
                });
            }
        });
    }
    updateDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield deliveryValidator_1.updateDeliveryData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.DeliveryTable.update(req.body, {
                    where: { delivery_id: req.body.delivery_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating delivery configuration data',
                    body: err
                });
            }
        });
    }
    removeDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const response = yield database_1.DeliveryTable.destroy({
                    where: { branch_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    BlockData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let response = yield database_1.BlockTable.findAll({
                    where: { area_id: id }
                });
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    deliveryAmount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { branch_id, area_id } = req.query;
                let filterArray = [];
                let response = yield database_1.DeliveryTable.findAll({
                    where: { branch_id: branch_id },
                    raw: true
                });
                if (response.length > 0) {
                    filterArray = response[0].area_list.filter((r) => {
                        return r.area_id == area_id;
                    });
                }
                return response_1.success(res, filterArray);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    deliveryAmountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield deliveryValidator_1.deliveryAmountDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let response;
                let hrmm = req.body.delivery_time.split(':');
                let minutes = (+hrmm[0]) * 60 + (+hrmm[1]);
                req.body.delivery_time = minutes;
                response = yield database_1.DeliveryAmountTable.create(req.body, {
                    returning: true
                });
                response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    fetchingDeliveryAmountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { branch_id, brand_id } = req.query;
                let response;
                if (brand_id) {
                    response = yield database_1.DeliveryAmountTable.findAll({
                        where: { brand_id: brand_id },
                        raw: true
                    });
                    return response_1.success(res, response);
                }
                if (branch_id) {
                    response = yield database_1.DeliveryAmountTable.findAll({
                        where: { branch_id: branch_id },
                        raw: true
                    });
                    return response_1.success(res, response);
                }
                response = yield database_1.DeliveryAmountTable.findAll({});
                response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    updateDeliveryAmountData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { branch_id } = req.body;
                let response;
                /** input validations */
                let validation = yield deliveryValidator_1.updateDeliveryAmountData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                if (branch_id) {
                    if (req.body.delivery_time) {
                        let hrmm = req.body.delivery_time.split(':');
                        let minutes = (+hrmm[0]) * 60 + (+hrmm[1]);
                        req.body.delivery_time = minutes;
                    }
                    response = yield database_1.DeliveryAmountTable.update(req.body, {
                        where: { branch_id: branch_id }
                    });
                }
                response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.deliveryController = deliveryController;
//# sourceMappingURL=deliveryController.js.map