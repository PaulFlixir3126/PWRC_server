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
exports.modifierGroupController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class modifierGroupController {
    modifierGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.ModifierGroupTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while creating Modifier Group',
                    body: err
                });
            }
        });
    }
    updateModifierGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { modifier_group_id } = req.body;
            try {
                const response = yield database_1.ModifierGroupTable.update(req.body, {
                    where: { modifier_group_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating Modifier Group',
                    body: err
                });
            }
        });
    }
    returnModifierGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, brand_id } = req.query;
                let response;
                if (brand_id) {
                    response = yield database_1.ModifierGroupTable.findAll({
                        where: { brand_id: brand_id },
                        include: [database_1.BrandTable]
                    });
                    return response_1.success(res, response.reverse());
                }
                id
                    ? (response = yield database_1.ModifierGroupTable.findAll({
                        where: { modifier_group_id: id }
                    }))
                    : (response = yield database_1.ModifierGroupTable.findAll({
                        include: [database_1.BrandTable]
                    }));
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                console.log(err);
                next({
                    status: false,
                    message: 'some error occurred while retrieving Modifier Group',
                    body: err
                });
            }
        });
    }
    deleteModifierGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                const response = yield database_1.ModifierGroupTable.destroy({
                    where: { modifier_group_id: id }
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
exports.modifierGroupController = modifierGroupController;
//# sourceMappingURL=modifierGroupController.js.map