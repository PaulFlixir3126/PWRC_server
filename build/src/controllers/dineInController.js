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
exports.dineInController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const dineInValidator_1 = require("../validators/dineInValidator");
class dineInController {
    dineInData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield dineInValidator_1.dineInDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.DineInTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while creating table configuration',
                    body: err
                });
            }
        });
    }
    returndineInData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                const response = yield database_1.DineInTable.findAll({
                    raw: true,
                    where: { branch_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching table configuration data',
                    body: err
                });
            }
        });
    }
    updatedineInData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield dineInValidator_1.updatedineInData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let check = false;
                for (const i of req.body.table_data) {
                    if (i.table_Name == '' || i.table_Name == null || i.table_Name == 'undefined') {
                        check = true;
                    }
                }
                if (check == true) {
                    return next({
                        status: false,
                        message: 'Please enter table number'
                    });
                }
                const response = yield database_1.DineInTable.update(req.body, {
                    where: { branch_id: req.body.branch_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating table configuration data',
                    body: err
                });
            }
        });
    }
    removedineInData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield dineInValidator_1.removedineInData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { id } = req.query;
                const response = yield database_1.DineInTable.destroy({
                    where: { branch_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.dineInController = dineInController;
//# sourceMappingURL=dineInController.js.map