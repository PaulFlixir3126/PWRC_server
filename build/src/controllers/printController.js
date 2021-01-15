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
exports.printController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class printController {
    printData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.PrintTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while adding printer for cashier',
                    body: err
                });
            }
        });
    }
    updatePrintData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cashier_id } = req.body;
            try {
                const response = yield database_1.PrintTable.update(req.body, {
                    where: { cashier_id: cashier_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating printer',
                    body: err
                });
            }
        });
    }
    returnPrintData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                const response = yield database_1.PrintTable.findAll({
                    where: { cashier_id: id },
                    raw: true
                });
                return response_1.success(res, response.reverse());
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
    deletePrintData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                const response = yield database_1.PrintTable.destroy({
                    where: { print_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Internal server error',
                    body: err
                });
            }
        });
    }
}
exports.printController = printController;
//# sourceMappingURL=printController.js.map