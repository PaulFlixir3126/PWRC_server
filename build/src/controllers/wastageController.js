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
exports.wastageController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class wastageController {
    addWastage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                // let validation:any = await addwastage(req.body);
                // if (!validation.status) {
                //   let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
                // 	return res.status(validation.code).send(obj);
                // }
                let check;
                if (req.body.type == 'branch_wastage') {
                    check = yield branch_wastage(req.body.data);
                }
                if (req.body.type == 'warehouse_wastage') {
                    check = yield warehouse_wastage(req.body.data);
                }
                if (!check.status) {
                    return res.status(404).send(check);
                }
                let response = yield database_1.WastageTable.bulkCreate(req.body.data, { returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while saving wastage details",
                    body: error.message
                });
            }
        });
    }
    getWastage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let todate:any=req.query.todate;
                // let fromdate:any=req.query.fromdate;
                // let brand_id:any=req.query.brand_id;
                // let branch_id:any=req.query.branch_id;
                // let limit:any=req.query.limit;
                // let offset:any=req.query.offset;
                // let response: any = await WastageTable.findAll({
                //   where: { brand_id:brand_id,branch_id:branch_id,
                //     createdAt: {
                //       [Op.between]: [fromdate, todate]
                //     }
                //   },
                //   include: [{ model: StockDetailTable },{ model: BrandTable }],
                //   order: [["wastage_id", "DESC"]],
                //   limit: limit,
                //   offset:offset
                // });
                let query = req.query;
                let wherequery = {};
                let sort = [];
                if (parseInt(query.filterbyBranch)) {
                    if ((query.from_branch_id == undefined) || (query.from_branch_id == null) || (query.from_branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass branch_id', data: {} });
                    }
                    let arr = query.branch_id.split(',');
                    wherequery.branch_id = arr;
                }
                if (parseInt(query.filterbyWarehouse)) {
                    if ((query.warehouse_id == undefined) || (query.warehouse_id == null) || (query.warehouse_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass warehouse_id', data: {} });
                    }
                    let arr = query.warehouse_id.split(',');
                    wherequery.warehouse_id = arr;
                }
                if (query.fromdate && query.todate) {
                    if ((query.fromdate == undefined) || (query.fromdate == null) || (query.fromdate == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass fromdate', data: {} });
                    }
                    if ((query.todate == undefined) || (query.todate == null) || (query.todate == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass todate', data: {} });
                    }
                    wherequery['createdAt'] = { [database_1.Op.between]: [query.fromdate, query.todate] };
                }
                if (!query.sortBy || !query.sortType) {
                    sort = ['updatedAt', 'DESC'];
                }
                let response = yield database_1.WastageTable.findAndCountAll({ where: wherequery,
                    include: [{ model: database_1.warehouse, },
                        { model: database_1.BranchTable, },
                        { model: database_1.BrandTable },
                        { model: database_1.MasterItemTable },
                        { model: database_1.StockDetailTable }
                    ],
                    order: [sort],
                    limit: query.limit,
                    offset: query.offset,
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while getting wastage details",
                    body: error.message
                });
            }
        });
    }
}
exports.wastageController = wastageController;
function branch_wastage(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < body.length; i++) {
            let addQuantity = parseFloat(body[i].wastageQty);
            if (addQuantity != null || addQuantity > 0 || addQuantity != NaN) {
                let wastage_reduce = { item_id: body[i].item_id, brand_id: body[i].brand_id, branch_id: body[i].branch_id, is_from_warehouse: false };
                let BranchItem = yield database_1.StockDetailTable.findAll({ where: wastage_reduce });
                if (BranchItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in branch stock', data: wastage_reduce };
                }
                const reduceQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].wastageQty)}`) }, { where: wastage_reduce, returning: true });
            }
            if (i == body.length - 1) {
                return { status: true };
            }
        }
    });
}
function warehouse_wastage(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < body.length; i++) {
            let addQuantity = parseFloat(body[i].wastageQty);
            if (addQuantity != null || addQuantity > 0 || addQuantity != NaN) {
                let wastage_reduce = { item_id: body[i].item_id, brand_id: body[i].brand_id, warehouse_id: body[i].warehouse_id, is_from_warehouse: true };
                let WarehouseItem = yield database_1.StockDetailTable.findAll({ where: wastage_reduce });
                if (WarehouseItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in warehouse stock', data: wastage_reduce };
                }
                const reduceQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].wastageQty)}`) }, { where: wastage_reduce, returning: true });
            }
            if (i == body.length - 1) {
                return { status: true };
            }
        }
    });
}
//# sourceMappingURL=wastageController.js.map