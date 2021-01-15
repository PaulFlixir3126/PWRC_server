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
exports.branchPrinterController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class branchPrinterController {
    printerData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield database_1.BranchPrintTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while submitting printer data',
                    body: err
                });
            }
        });
    }
    returnPrinterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                let response;
                response = yield database_1.BranchPrintTable.findAll({
                    raw: true,
                    where: { branch_id: id }
                });
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving printer data',
                    body: err
                });
            }
        });
    }
    updatePrinterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branch_id } = req.body;
                let response = yield database_1.BranchPrintTable.update(req.body, {
                    where: {
                        branch_id: branch_id
                    },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating printer Data',
                    body: err
                });
            }
        });
    }
}
exports.branchPrinterController = branchPrinterController;
//# sourceMappingURL=branchPrinterController.js.map