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
exports.stockcountController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const stockcountValidator_1 = require("../validators/stockcountValidator");
class stockcountController {
    stockcount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield stockcountValidator_1.stockcountsave(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let response;
                let body = req.body.data;
                let date = req.body.stockcountdate + " 05:30:00+05:30";
                if (req.body.status == "new") {
                    let checkConfirmStatusOnStockcountdate = yield database_1.StockCountTable.findAll({
                        where: {
                            brand_id: req.body.brand_id,
                            branch_id: req.body.branch_id,
                            stockcountdate: date,
                            status: "confirm"
                        }
                    });
                    if (checkConfirmStatusOnStockcountdate.length > 0) {
                        response = {
                            message: "stock already confirm on same date u can not save new stockcounts"
                        };
                        return response_1.success(res, response);
                    }
                    let checkstatus = yield database_1.StockCountTable.findAll({
                        where: {
                            brand_id: req.body.brand_id,
                            branch_id: req.body.branch_id,
                            stockcountdate: date
                        }
                    });
                    if (checkstatus.length > 0) {
                        for (let i = 0; i < body.length; i++) {
                            if (body[i].countedQty != undefined || body[i].countedQty != null) {
                                const response1 = yield database_1.StockCountTable.update({
                                    countedQty: body[i].countedQty,
                                    stockcountdate: body[i].stockcountdate,
                                    status: body[i].status
                                }, {
                                    where: {
                                        stockcount_id: body[i].stockcount_id,
                                        status: "new",
                                        // item_id: body[i].item_id,
                                        brand_id: body[i].brand_id,
                                        branch_id: body[i].branch_id
                                    },
                                    returning: true
                                });
                            }
                            if (i == body.length - 1) {
                                console.log("finish");
                                response = { message: "stock count saved" };
                                return response_1.success(res, response);
                            }
                        }
                    }
                    response = yield database_1.StockCountTable.bulkCreate(body, { returning: true });
                    return response_1.success(res, response);
                }
                /**if status is confirm first update the master item quantity then save the bulk data status:confirm */
                if (req.body.status == "confirm") {
                    let findcomfirmstatus = yield database_1.StockCountTable.findAll({
                        where: {
                            brand_id: JSON.parse(req.body.brand_id),
                            branch_id: req.body.branch_id,
                            stockcountdate: date,
                            status: "confirm"
                        }
                    });
                    if (findcomfirmstatus.length > 0) {
                        let obj = { message: "you can not update once it confirm" };
                        return response_1.success(res, obj);
                    }
                    for (let i = 0; i < body.length; i++) {
                        if (body[i].countedQty != undefined || body[i].countedQty != null) {
                            const updateqty = yield database_1.StockDetailTable.update({ quantity: body[i].countedQty }, {
                                where: {
                                    item_id: body[i].item_id,
                                    branch_id: body[i].branch_id,
                                    brand_id: body[i].brand_id
                                },
                                returning: true
                            });
                        }
                        if (i == body.length - 1) {
                            console.log("finish");
                            response = yield database_1.StockCountTable.bulkCreate(body, {
                                returning: true
                            });
                            return response_1.success(res, response);
                        }
                    }
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: err.message
                });
            }
        });
    }
    getstockcount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                if (query.stockcountdate != undefined &&
                    query.status != undefined) {
                    let stockcoundate = query.stockcountdate;
                    let date = stockcoundate + " 05:30:00+05:30";
                    console.log("stockcount date", date);
                    let response = yield database_1.StockCountTable.findAll({
                        where: {
                            brand_id: JSON.parse(query.brand_id),
                            branch_id: query.branch_id,
                            stockcountdate: date,
                            status: query.status
                        },
                        include: [{ model: database_1.StockDetailTable }]
                    });
                    return response_1.success(res, response);
                }
                let test = yield database_1.StockCountTable.findAll({
                    where: {
                        brand_id: JSON.parse(query.brand_id),
                        branch_id: query.branch_id
                    },
                    attributes: [
                        "stockcountdate",
                        [database_1.Sequelize.fn("ARRAY_AGG", database_1.Sequelize.col("status")), "status"]
                    ],
                    raw: true,
                    group: ["stockcountdate", "status"]
                });
                return response_1.success(res, test);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: err.message
                });
            }
        });
    }
    updatestockcount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield stockcountValidator_1.stockcountupdate(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let body = req.body.data;
                let response;
                let date = req.body.stockcountdate + " 05:30:00+05:30";
                let findcomfirmstatus = yield database_1.StockCountTable.findAll({
                    where: {
                        brand_id: JSON.parse(req.body.brand_id),
                        branch_id: req.body.branch_id,
                        stockcountdate: date,
                        status: "confirm"
                    }
                });
                if (findcomfirmstatus.length > 0) {
                    let obj = { message: "you can not update once it confirm" };
                    return response_1.success(res, obj);
                }
                for (let i = 0; i < body.length; i++) {
                    if (body[i].countedQty != undefined || body[i].countedQty != null) {
                        const updateqty = yield database_1.StockDetailTable.update({ quantity: body[i].countedQty }, {
                            where: {
                                item_id: body[i].item_id,
                                branch_id: body[i].branch_id,
                                brand_id: body[i].brand_id
                            },
                            returning: true
                        });
                        const response1 = yield database_1.StockCountTable.update({
                            countedQty: body[i].countedQty,
                            stockcountdate: body[i].stockcountdate,
                            status: body[i].status
                        }, {
                            where: {
                                stockcount_id: body[i].stockcount_id,
                                status: "new",
                                // item_id: body[i].item_id,
                                brand_id: body[i].brand_id,
                                branch_id: body[i].branch_id
                            },
                            returning: true
                        });
                    }
                    if (i == body.length - 1) {
                        console.log("finish");
                        response = { message: "stockcountupdated" };
                        return response_1.success(res, response);
                    }
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: err.message
                });
            }
        });
    }
}
exports.stockcountController = stockcountController;
//# sourceMappingURL=stockCountController.js.map