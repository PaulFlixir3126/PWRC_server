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
exports.categoryCatalogController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const queryBuilder_1 = require("../lib/queryBuilder");
const categoryCatalogValidator_1 = require("../validators/categoryCatalogValidator");
class categoryCatalogController {
    categoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield categoryCatalogValidator_1.categoryDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { brand_id, category_name } = req.body;
                let response = yield database_1.CategoryCatalogTable.findOne({
                    where: database_1.Sequelize.and({ brand_id, category_name })
                });
                if (!response) {
                    response = yield database_1.CategoryCatalogTable.create(req.body);
                    return response_1.success(res, response);
                }
                next({ message: 'Duplicate Category' });
            }
            catch (err) {
                next({
                    message: 'Some error occurred while creating category',
                    body: err
                });
            }
        });
    }
    updateCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category_id } = req.body;
            try {
                /** input validations */
                let validation = yield categoryCatalogValidator_1.updateCategoryData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.CategoryCatalogTable.update(req.body, {
                    where: { category_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    message: 'Some error occurred while updating category',
                    body: err
                });
            }
        });
    }
    returnCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response, query = queryBuilder_1.queryBuilder(req.query);
                const { category_status } = query, { verbose } = req.query, status = { category_status: true };
                if (category_status) {
                    delete status.category_status;
                    delete query.category_status;
                }
                if (verbose) {
                    query = Object.assign(Object.assign({}, query), status);
                    let find = { where: database_1.Sequelize.and(query), include: [{ model: database_1.ImageUploadTable }] };
                    let result = yield database_1.CategoryCatalogTable.findAll(find);
                    result.sort((a, b) => +a.category_order - +b.category_order);
                    return response_1.success(res, result);
                }
                response = yield database_1.CategoryCatalogTable.findAll({ where: status, include: [{ model: database_1.ImageUploadTable }] });
                response.sort((a, b) => +a.category_order - +b.category_order);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    message: 'Some error occurred while retrieving category',
                    body: err
                });
            }
        });
    }
    deleteCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                /** input validations */
                let validation = yield categoryCatalogValidator_1.deleteCategoryData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let menures = yield database_1.NewMenuTable.findAll({
                    where: {
                        category_id: id
                    }
                });
                let menuResponse = JSON.parse(JSON.stringify(menures));
                if (menuResponse.length === 0) {
                    const response = yield database_1.CategoryCatalogTable.destroy({
                        where: { category_id: id }
                    });
                    return response_1.success(res, menuResponse);
                }
                else {
                    let obj = { message: 'category already added in menu, you cant delete' };
                    return next({ status: true, message: obj.message, body: {} });
                }
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
exports.categoryCatalogController = categoryCatalogController;
//# sourceMappingURL=categoryCatalogController.js.map