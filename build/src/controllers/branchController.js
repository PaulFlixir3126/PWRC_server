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
exports.branchController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const branchValidator_1 = require("../validators/branchValidator");
class branchController {
    branchData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield branchValidator_1.branchData(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { branch_name, brand_id } = req.body;
                let response = yield database_1.BranchTable.findOne({
                    where: { branch_name: branch_name, brand_id: brand_id }
                });
                if (!response) {
                    response = yield database_1.BranchTable.create(req.body);
                    return response_1.success(res, response);
                }
                next({ message: 'Already Branch Name exists related to the brand' });
            }
            catch (err) {
                next({
                    message: 'Some error occurred while creating branch',
                    body: err
                });
            }
        });
    }
    updateBranchData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { branch_name, branch_id } = req.body;
            try {
                /** input validations */
                let validation = yield branchValidator_1.updateBranchData(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                // let filteredArray: any;
                // filteredArray = await OrderTable.findAll({
                // 	attributes: ['branch_id'],
                // 	where: { branch_id: req.body.branch_id }
                // });
                // if (filteredArray.length > 0) {
                // 	let obj={ status: false, message: 'Order already taken for this branch' }
                // 	return success(res, obj);
                // }
                let response = yield database_1.BranchTable.findOne({
                    where: database_1.Sequelize.and({ branch_name, branch_id })
                });
                if (!response) {
                    const response = yield database_1.BranchTable.update(req.body, {
                        where: { branch_id: req.body.branch_id },
                        returning: true
                    });
                    return response_1.success(res, response);
                }
                next({ message: 'Already Branch Name exists related to the brand' });
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while updating branch', body: err });
            }
        });
    }
    returnBranchData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response, query = {}, { id, segment = '', brand_id, raw } = req.query;
                query['segment'] = true;
                if (raw) {
                    response = yield database_1.BranchTable.findAll({
                        include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }]
                    });
                    // let group_to_values = response.reduce(function(obj: any, item: any) {
                    // 	obj[item.brand.brand_name] = obj[item.brand.brand_name] || [];
                    // 	obj[item.brand.brand_name].push(item);
                    // 	return obj;
                    // }, {});
                    // let groups = Object.keys(group_to_values).map(function(key) {
                    // 	let branchData = group_to_values[key];
                    // 	return { group: key, branchData };
                    // });
                    return response_1.success(res, response.reverse());
                }
                if (brand_id) {
                    const brand_id = req.query.brand_id;
                    response = yield database_1.BranchTable.findAll({
                        where: { brand_id: brand_id, branch_status: true }
                    });
                }
                else {
                    id
                        ? (response = yield database_1.BranchTable.findAll({
                            include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }],
                            where: { branch_id: id, branch_status: true }
                        }))
                        : (response = yield database_1.BranchTable.findAll({
                            where: query
                        }));
                }
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({ status: false, message: 'Some error occurred while retrieving branch', body: err });
            }
        });
    }
    deleteBranchData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                /** input validations */
                let validation = yield branchValidator_1.deleteBranchData(req.query);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let filteredArray;
                filteredArray = yield database_1.OrderTable.findAll({
                    attributes: ['branch_id'],
                    where: { branch_id: id }
                });
                if (filteredArray.length > 0) {
                    let obj = { status: false, message: 'Order already taken for this branch' };
                    return response_1.success(res, obj);
                }
                const branch_id = id;
                const response = yield database_1.BranchTable.destroy({
                    where: { branch_id: branch_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.branchController = branchController;
//# sourceMappingURL=branchController.js.map