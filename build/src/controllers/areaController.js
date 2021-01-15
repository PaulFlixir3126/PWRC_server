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
exports.areaController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const areaValidator_1 = require("../validators/areaValidator");
class areaController {
    areaData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                /** input validations */
                let validation = yield areaValidator_1.areaDataPOST(req);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        type: validation.type,
                        message: validation.message,
                        data: validation.data
                    };
                    return res.status(validation.code).send(obj);
                }
                response = yield database_1.GlobalAreaTable.create(req.body, {
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while adding Area ",
                    body: error.message
                });
            }
        });
    }
    createBlock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                /** input validations */
                let validation = yield areaValidator_1.createBlock(req);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        type: validation.type,
                        message: validation.message,
                        data: validation.data
                    };
                    return res.status(validation.code).send(obj);
                }
                response = yield database_1.BlockTable.bulkCreate(req.body, { returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while adding Block ",
                    body: error.message
                });
            }
        });
    }
    returnAreaData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sortObject = [];
                let sort = req.query.sort ? req.query.sort : "";
                switch (sort) {
                    case 'area_name_english_ASC':
                        sortObject = ['area_name_english', 'ASC'];
                        break;
                    case 'area_name_english_DESC':
                        sortObject = ['area_name_english', 'DESC'];
                        break;
                    case 'area_name_arabic_ASC':
                        sortObject = ['area_name_arabic', 'ASC'];
                        break;
                    case 'area_name_arabic_DESC':
                        sortObject = ['area_name_arabic', 'DESC'];
                        break;
                    default:
                        sortObject = ['updatedAt', 'DESC'];
                        break;
                }
                console.log("sortObject", sortObject);
                if (req.query.area_id === "all") {
                    let wherequery = {};
                    const response = yield database_1.GlobalAreaTable.findAll({
                        where: wherequery,
                        include: [{ model: database_1.BlockTable }],
                        order: [sortObject]
                    });
                    return response_1.success(res, response);
                }
                else {
                    const area_id = req.query.area_id;
                    const response = yield database_1.GlobalAreaTable.findAll({
                        where: {
                            area_id: area_id
                        },
                        include: [
                            {
                                model: database_1.BlockTable
                            }
                        ]
                    });
                    return response_1.success(res, response);
                }
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while fetching Area data",
                    body: err.message
                });
            }
        });
    }
    returnBlockData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const area_id = req.query.area_id;
                let sortObject = [];
                let sort = req.query.sort ? req.query.sort : "";
                switch (sort) {
                    case 'blocks_ASC':
                        sortObject = ['block', 'ASC'];
                        break;
                    case 'blocks_DESC':
                        sortObject = ['block', 'DESC'];
                        break;
                    default:
                        sortObject = ['updatedAt', 'DESC'];
                        break;
                }
                const response = yield database_1.BlockTable.findAll({
                    where: { area_id: area_id },
                    order: [sortObject]
                });
                // response.sort((a: any, b: any) => +b.customer_id - +a.customer_id);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while fetching Block data",
                    body: err.message
                });
            }
        });
    }
    updateAreaData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield areaValidator_1.updateAreaData(req);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        type: validation.type,
                        message: validation.message,
                        data: validation.data
                    };
                    return res.status(validation.code).send(obj);
                }
                let constraints = { area_id: req.body.area_id };
                const response = yield database_1.GlobalAreaTable.update(req.body, {
                    where: constraints,
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while updating area data",
                    body: err.message
                });
            }
        });
    }
    updateBlockData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield areaValidator_1.updateBlockData(req);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        type: validation.type,
                        message: validation.message,
                        data: validation.data
                    };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.BlockTable.update(req.body, {
                    where: { block_id: req.body.block_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while updating block data",
                    body: err.message
                });
            }
        });
    }
    removeAreaData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield areaValidator_1.removeAreaData(req);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        type: validation.type,
                        message: validation.message,
                        data: validation.data
                    };
                    return res.status(validation.code).send(obj);
                }
                const area_id = req.query.area_id;
                const response = yield database_1.GlobalAreaTable.destroy({
                    where: { area_id: area_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Internal server error while removing area",
                    body: err.message
                });
            }
        });
    }
    removeBlockData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield areaValidator_1.removeBlockData(req);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        type: validation.type,
                        message: validation.message,
                        data: validation.data
                    };
                    return res.status(validation.code).send(obj);
                }
                let block_id = req.query.block_id;
                const response = yield database_1.BlockTable.destroy({
                    where: { block_id: block_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, type: 'internalServerError', message: "Internal server error while removing block", body: err.message });
            }
        });
    }
}
exports.areaController = areaController;
//# sourceMappingURL=areaController.js.map