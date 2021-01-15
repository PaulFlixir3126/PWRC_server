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
exports.managerController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class managerController {
    managerData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.managerTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while creating brand', body: err });
            }
        });
    }
    returnManagerData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let { branch_id, transaction_date } = req.query;
                response = yield database_1.managerTable.findAll({
                    where: {
                        transaction_date: transaction_date,
                        branch_id: branch_id
                    },
                    raw: true
                });
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({ status: false, message: 'Some error', body: err });
            }
        });
    }
}
exports.managerController = managerController;
//# sourceMappingURL=managerController.js.map