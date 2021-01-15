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
exports.modifierCatalogController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const queryBuilder_1 = require("../lib/queryBuilder");
class modifierCatalogController {
    modifierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { brand_id, modifier_name } = req.body;
                let response = yield database_1.ModifierCatalogTable.findOne({
                    where: database_1.Sequelize.and({ brand_id, modifier_name })
                });
                if (!response) {
                    response = yield database_1.ModifierCatalogTable.create(req.body);
                    return response_1.success(res, response);
                }
                next({ message: 'Duplicate Modifier' });
            }
            catch (err) {
                next({
                    message: 'Some error occurred while creating modifier',
                    body: err
                });
            }
        });
    }
    updateModifierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { modifier_id } = req.body;
            try {
                const response = yield database_1.ModifierCatalogTable.update(req.body, {
                    where: { modifier_id: modifier_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    message: 'Some error occurred while updating modifier',
                    body: err
                });
            }
        });
    }
    returnModifierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { verbose } = req.query;
                const key = `modifier_id`;
                const query = queryBuilder_1.queryBuilder(req.query, key);
                let response;
                if (verbose) {
                    response = yield database_1.ModifierCatalogTable.findAll({
                        where: database_1.Sequelize.and(query)
                    });
                    return response_1.success(res, response.reverse());
                }
                query[key]
                    ? (response = yield database_1.ModifierCatalogTable.findAll({
                        where: database_1.Sequelize.and(query)
                    }))
                    : (response = yield database_1.ModifierCatalogTable.findAll({}));
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    message: 'Some error occurred while retrieving modifiers',
                    body: err
                });
            }
        });
    }
    deleteModifierData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                const response = yield database_1.ModifierCatalogTable.destroy({
                    where: { modifier_id: id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    message: 'Internal server error',
                    body: err
                });
            }
        });
    }
}
exports.modifierCatalogController = modifierCatalogController;
//# sourceMappingURL=modifierCatalogController.js.map