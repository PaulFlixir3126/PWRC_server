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
exports.onlineDeliveryController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class onlineDeliveryController {
    onlineDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                {
                    let online_Type = [];
                    req.body.online_type.map((ele) => {
                        // ele['brand_id'] = req.body.brand_id;
                        // ele['branch_id'] = req.body.branch_id;
                        online_Type.push(ele);
                    });
                    const response = yield database_1.OnlineTypeTable.bulkCreate(online_Type, { returning: true });
                    return response_1.success(res, response);
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching onlineDelivery data',
                    body: err
                });
            }
        });
    }
    returnOnlineDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id, raw, brand_id } = req.query;
                let findquery = {};
                if (req.query.onlinetype_id) {
                    findquery.onlinetype_id = req.query.onlinetype_id;
                }
                let responses = yield database_1.OnlineTypeTable.findAll({
                    where: findquery,
                    order: [['updatedAt', 'DESC']],
                });
                let obj = {
                    onlinetypes: responses
                };
                return response_1.success(res, obj);
                // if (raw == 'true') {
                // 	let response: any = await BranchTable.findAll({
                // 		include: [{ model: OnlineTypeTable }, { model: BrandTable }]
                // 	});
                // 	response.sort((a: any, b: any) => +a.brand.brand_id - +b.brand.brand_id);
                // 	return success(res, response.reverse());
                // }
                // if (id) {
                // 	const response: any = await BranchTable.findAll({
                // 		where: { branch_id: id },
                // 		include: [{ model: OnlineTypeTable }, { model: BrandTable }]
                // 	});
                // 	return success(res, response.reverse());
                // }
                // if (brand_id) {
                // 	const response: any = await BranchTable.findAll({
                // 		include: [
                // 			{ model: OnlineTypeTable, where: { brand_id: brand_id } },
                // 			{ model: BrandTable }
                // 		]
                // 	});
                // 	response.sort((a: any, b: any) => +a.brand.brand_id - +b.brand.brand_id);
                // 	return success(res, response.reverse());
                // }
                // const response: any = await BranchTable.findAll({
                // 	include: [{ model: OnlineTypeTable }, { model: BrandTable }]
                // });
                // response.sort((a: any, b: any) => +a.brand.brand_id - +b.brand.brand_id);
                // return success(res, response.reverse());
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching online delivery data',
                    body: err
                });
            }
        });
    }
    updateOnlineDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.online_type.map((ele) => __awaiter(this, void 0, void 0, function* () {
                    let update = {
                        online_type_english: ele.online_type_english,
                        online_type_arabic: ele.online_type_arabic,
                        brand_id: ele.brand_id,
                        branch_id: ele.branch_id,
                        online_status: ele.online_status
                    };
                    const response = yield database_1.OnlineTypeTable.update(update, {
                        where: { onlinetype_id: ele.onlinetype_id },
                        returning: true
                    });
                }));
                // let response2: any = await BranchTable.findAll({
                // 	include: [{ model: OnlineTypeTable }, { model: BrandTable }]
                // });
                // return success(res, response2.reverse());
                let responses = yield database_1.OnlineTypeTable.findAll({
                    where: {},
                    order: [['updatedAt', 'DESC']],
                });
                let obj = {
                    onlinetypes: responses
                };
                return response_1.success(res, obj);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating onlineDelivery data',
                    body: err
                });
            }
        });
    }
    removeOnlineDeliveryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const response = yield database_1.OnlineTypeTable.destroy({
                    where: { branch_id: parseInt(id) }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    removeOnlineData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let onlinetype_id = req.query.onlinetype_id;
                const orderRes = yield database_1.OrderTable.findAll({ where: { onlinetype_id: onlinetype_id } });
                let parseorder = JSON.parse(JSON.stringify(orderRes));
                if (parseorder.length > 0) {
                    return next({
                        status: false,
                        message: 'onlinesource already added in order, you cant delete',
                        body: {}
                    });
                }
                else {
                    const response = yield database_1.OnlineTypeTable.destroy({
                        where: { onlinetype_id: parseInt(onlinetype_id) }
                    });
                    return response_1.success(res, response);
                }
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
}
exports.onlineDeliveryController = onlineDeliveryController;
//# sourceMappingURL=onlineDeliveryController.js.map