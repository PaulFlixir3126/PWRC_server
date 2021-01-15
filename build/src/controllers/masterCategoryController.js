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
exports.masterCategoryController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class masterCategoryController {
    masterCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                const { category_name_english, brand_id } = req.body;
                response = yield database_1.MasterCategoryTable.findOne({
                    where: {
                        category_name_english: category_name_english,
                        brand_id: brand_id
                    }
                });
                if (!response) {
                    response = yield database_1.MasterCategoryTable.create(req.body);
                    return response_1.success(res, response);
                }
                next({ message: 'Already category name exists related to the brand' });
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while configuration',
                    body: err
                });
            }
        });
    }
    returnMasterCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let response;
                if (id) {
                    response = yield database_1.MasterCategoryTable.findAll({
                        where: { brand_id: id },
                        raw: true
                    });
                    response.sort((a, b) => +a.category_id - +b.category_id);
                    return response_1.success(res, response);
                }
                response = yield database_1.MasterCategoryTable.findAll({
                    include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }]
                });
                response.sort((a, b) => +a.category_id - +b.category_id);
                let group_to_values = response.reduce(function (obj, item) {
                    obj[item.brand.brand_name] = obj[item.brand.brand_name] || [];
                    obj[item.brand.brand_name].push(item);
                    return obj;
                }, {});
                let groups = Object.keys(group_to_values).map(function (key) {
                    return { brand: key, data: group_to_values[key] };
                });
                return response_1.success(res, groups);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: err
                });
            }
        });
    }
    updateMasterCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.MasterCategoryTable.update(req.body, {
                    where: { category_id: req.body.category_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating configuration data',
                    body: err
                });
            }
        });
    }
    removeMasterCategoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { category_id, brand_id } = req.query;
                let response;
                let itemResponse;
                let categoryResponse;
                let filter;
                itemResponse = yield database_1.MasterItemTable.findAll({
                    where: { brand_id: brand_id }
                });
                categoryResponse = yield database_1.MasterCategoryTable.findAll({
                    where: { category_id: category_id }
                });
                filter = yield new Promise(resolve => {
                    resolve(itemResponse.filter((r) => {
                        return r.category_code == categoryResponse[0].category_code;
                    }));
                });
                if (filter.length >= 1) {
                    return next({ status: false, message: 'Item already mapped to given category' });
                }
                response = yield database_1.MasterCategoryTable.destroy({
                    where: { category_id: category_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.masterCategoryController = masterCategoryController;
//# sourceMappingURL=masterCategoryController.js.map