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
exports.printConfigController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const printerValidatior_1 = require("../validators/printerValidatior");
class printConfigController {
    printerData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield printerValidatior_1.printerDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.PrintConfigTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while adding printer',
                    body: err
                });
            }
        });
    }
    updatePrinterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                /** input validations */
                let validation = yield printerValidatior_1.updatePrinterData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.PrintConfigTable.update(req.body, {
                    where: { printer_id: id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating printer configuration',
                    body: err
                });
            }
        });
    }
    returnPrinterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.PrintConfigTable.findAll({
                    raw: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving printer',
                    body: err
                });
            }
        });
    }
    deletePrinterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                /** input validations */
                let validation = yield printerValidatior_1.deletePrinterData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.PrintConfigTable.destroy({
                    where: { printer_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Internal server error',
                    body: err.message
                });
            }
        });
    }
}
exports.printConfigController = printConfigController;
//# sourceMappingURL=printConfigController.js.map