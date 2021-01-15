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
exports.stockDetailController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const masteritemValidator_1 = require("../validators/masteritemValidator");
const stockdetailvalidator_1 = require("../validators/stockdetailvalidator");
class stockDetailController {
    searchItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchBy = req.query.searchBy;
                let search = req.query.keyword;
                let brand_id = req.query.brand_id;
                let branch_id = req.query.branch_id;
                let type = req.query.type;
                let warehouseItem = false;
                let s = search + "%";
                let response;
                if (branch_id && brand_id && type == undefined) {
                    if (searchBy == "item_name") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
					WHERE brand_id=${brand_id} and branch_id=${branch_id} and is_from_warehouse=${warehouseItem} and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == "item_code") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
				 WHERE brand_id=${brand_id} and branch_id=${branch_id} and is_from_warehouse=${warehouseItem} and lower(item_code) ILIKE '${s}' `);
                    }
                }
                if (brand_id && branch_id == undefined && type == undefined) {
                    if (searchBy == "item_name") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
					WHERE brand_id=${brand_id} and is_from_warehouse=${warehouseItem}  and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == "item_code") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
				 WHERE brand_id=${brand_id} and is_from_warehouse=${warehouseItem} and lower(item_code) ILIKE '${s}' `);
                    }
                }
                if (brand_id && branch_id && type != undefined) {
                    if (searchBy == "item_name") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
					WHERE brand_id=${brand_id} and branch_id=${branch_id} and is_from_warehouse=${warehouseItem} and type='${type}' and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == "item_code") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
				 WHERE brand_id=${brand_id} and branch_id=${branch_id} and is_from_warehouse=${warehouseItem} and type='${type}' and lower(item_code) ILIKE '${s}' `);
                    }
                }
                return response_1.success(res, response[0]);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Internal server error",
                    body: error.message
                });
            }
        });
    }
    warehousesearchItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchBy = req.query.searchBy;
                let search = req.query.keyword;
                let brand_id = req.query.brand_id;
                let warehouse_id = req.query.warehouse_id;
                let type = req.query.type;
                let warehouseItem = true;
                let s = search + "%";
                let response;
                if (warehouse_id && brand_id && type == undefined) {
                    if (searchBy == "item_name") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
					WHERE brand_id=${brand_id} and warehouse_id=${warehouse_id} and is_from_warehouse=${warehouseItem} and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == "item_code") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
				 WHERE brand_id=${brand_id} and warehouse_id=${warehouse_id} and is_from_warehouse=${warehouseItem} and lower(item_code) ILIKE '${s}' `);
                    }
                }
                if (brand_id && warehouse_id == undefined && type == undefined) {
                    if (searchBy == "item_name") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
					WHERE brand_id=${brand_id} and is_from_warehouse=${warehouseItem}  and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == "item_code") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
				 WHERE brand_id=${brand_id} and is_from_warehouse=${warehouseItem} and lower(item_code) ILIKE '${s}' `);
                    }
                }
                if (brand_id && warehouse_id && type != undefined) {
                    if (searchBy == "item_name") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
					WHERE brand_id=${brand_id} and warehouse_id=${warehouse_id} and is_from_warehouse=${warehouseItem} and type='${type}' and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == "item_code") {
                        response = yield database_1.sequelize.query(`SELECT * FROM   stockdetails
				 WHERE brand_id=${brand_id} and warehouse_id=${warehouse_id} and is_from_warehouse=${warehouseItem} and type='${type}' and lower(item_code) ILIKE '${s}' `);
                    }
                }
                return response_1.success(res, response[0]);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Internal server error",
                    body: error.message
                });
            }
        });
    }
    createstockdetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let createStockdata = yield database_1.StockDetailTable.create(req.body);
                return response_1.success(res, {});
            }
            catch (error) { }
        });
    }
    returnStockDetailsItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id, branch_id } = req.query;
                let response;
                if (id) {
                    response = yield database_1.StockDetailTable.findAll({
                        where: { brand_id: id, branch_id: branch_id },
                        // limit:5,
                        include: [
                            {
                                model: database_1.BrandTable,
                                attributes: ["brand_name"]
                            }
                        ]
                    });
                    response.sort((a, b) => +b.item_id - +a.item_id);
                    let categoryResponse = yield database_1.MasterCategoryTable.findAll({
                        where: { brand_id: id }
                    });
                    let obj = {
                        itemResponse: response,
                        categoryResponse: categoryResponse
                    };
                    return response_1.success(res, obj);
                }
                response = yield database_1.StockDetailTable.findAll({
                    include: [
                        {
                            model: database_1.BrandTable,
                            attributes: ["brand_name", "brand_id"]
                        }
                    ]
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while fetching  data",
                    body: err.message
                });
            }
        });
    }
    updateQunatity(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield masteritemValidator_1.updatequantity(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let body = req.body;
                let finaloutput = [];
                for (let i = 0; i < body.length; i++) {
                    let response = yield database_1.StockDetailTable.find({
                        where: {
                            item_code: body[i].item_code,
                            item_id: body[i].item_id,
                            brand_id: body[i].brand_id,
                            branch_id: body[i].branch_id
                        }
                    });
                    let itemRes = JSON.parse(JSON.stringify(response));
                    let addQuantity = itemRes.quantity - parseFloat(body[i].transferQty);
                    let check = {
                        item_code: body[i].item_code,
                        availableqty: itemRes.quantity,
                        supplyqty: body[i].transferQty,
                        finalqty: addQuantity
                    };
                    if (addQuantity != null || addQuantity >= 0 || addQuantity != NaN) {
                        const reduceQty = yield database_1.StockDetailTable.update({
                            quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].transferQty)}`)
                        }, {
                            where: {
                                item_code: body[i].item_code,
                                item_id: body[i].item_id,
                                brand_id: body[i].brand_id,
                                branch_id: body[i].branch_id
                            },
                            returning: true
                        });
                        const increaseQty = yield database_1.StockDetailTable.update({
                            quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].transferQty)}`)
                        }, {
                            where: {
                                item_code: body[i].item_code,
                                item_id: body[i].item_id,
                                brand_id: body[i].brand_id,
                                branch_id: body[i].branch
                            },
                            returning: true
                        });
                        finaloutput.push(check);
                    }
                    if (i == body.length - 1) {
                        let finalres = {
                            message: "stockdetail quantity updated successfully",
                            data: finaloutput
                        };
                        return response_1.success(res, finalres);
                    }
                }
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while updating qunatity",
                    body: error.message
                });
            }
        });
    }
    reduceQunatity(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield masteritemValidator_1.updatequantity(req.body);
                if (!validation.status) {
                    let obj = {
                        status: false,
                        message: validation.message,
                        data: validation.data
                    };
                    return response_1.invalidRequest(res, obj);
                }
                let body = req.body;
                let finaloutput = [];
                for (let i = 0; i < body.length; i++) {
                    let response = yield database_1.StockDetailTable.find({
                        where: {
                            item_code: body[i].item_code,
                            item_id: body[i].item_id,
                            brand_id: body[i].brand_id,
                            branch_id: body[i].branch_id
                        }
                    });
                    let itemRes = JSON.parse(JSON.stringify(response));
                    let addQuantity = itemRes.quantity - parseFloat(body[i].transferQty);
                    let check = {
                        item_code: body[i].item_code,
                        availableqty: itemRes.quantity,
                        supplyqty: body[i].transferQty,
                        finalqty: addQuantity
                    };
                    if (addQuantity != null || addQuantity >= 0 || addQuantity != NaN) {
                        const reduceQty = yield database_1.StockDetailTable.update({
                            quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].transferQty)}`)
                        }, {
                            where: {
                                item_code: body[i].item_code,
                                item_id: body[i].item_id,
                                brand_id: body[i].brand_id,
                                branch_id: body[i].branch_id
                            },
                            returning: true
                        });
                        finaloutput.push(check);
                    }
                    if (i == body.length - 1) {
                        let finalres = {
                            message: "stockdetail quantity updated successfully",
                            data: finaloutput
                        };
                        return response_1.success(res, finalres);
                    }
                }
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while updating qunatity",
                    body: error.message
                });
            }
        });
    }
    SFitemsStockcounts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let validation = yield stockdetailvalidator_1.sfstockcount(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let body = req.body.data;
                let finaloutput = [];
                for (let i = 0; i < body.length; i++) {
                    let response = yield database_1.StockDetailTable.findAll({
                        where: {
                            stock_detail_id: body[i].stock_detail_id,
                            item_id: body[i].item_id,
                            brand_id: body[i].brand_id,
                            branch_id: body[i].branch_id,
                            type: "SF"
                        }
                    });
                    let sfitemRes = JSON.parse(JSON.stringify(response));
                    if (sfitemRes.length > 0) {
                        const updateqty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].countedqty)}`) }, {
                            where: {
                                stock_detail_id: body[i].stock_detail_id,
                                item_id: body[i].item_id,
                                branch_id: body[i].branch_id,
                                brand_id: body[i].brand_id,
                                type: "SF"
                            },
                            returning: true
                        });
                        finaloutput.push(JSON.parse(JSON.stringify(updateqty)));
                    }
                    if (i == body.length - 1) {
                        let finalres = {
                            message: "sfstockdetail quantity updated successfully",
                            data: finaloutput
                        };
                        response = yield database_1.SFItemStockCount.bulkCreate(body, {
                            returning: true
                        });
                        return response_1.success(res, response);
                    }
                }
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while updating qunatity",
                    body: error.message
                });
            }
        });
    }
    getsfitems(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let brand_id = req.query.brand_id;
                let branch_id = req.query.branch_id;
                let type = req.query.type;
                let fromdate = req.query.fromdate;
                let todate = req.query.todate;
                let response = yield database_1.SFItemStockCount.findAll({
                    where: {
                        brand_id: brand_id,
                        branch_id: branch_id,
                        createdAt: { [database_1.Op.between]: [fromdate, todate] }
                    },
                    include: [{ model: database_1.StockDetailTable }],
                    order: [["sfitem_stockcount_id", "DESC"]],
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while updating qunatity",
                    body: error.message
                });
            }
        });
    }
}
exports.stockDetailController = stockDetailController;
//# sourceMappingURL=stockdetailController.js.map