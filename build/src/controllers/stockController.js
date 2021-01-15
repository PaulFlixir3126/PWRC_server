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
exports.stockController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const stockdetailvalidator_1 = require("../validators/stockdetailvalidator");
class stockController {
    stockOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield stockdetailvalidator_1.stockOutSave(req.body);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let check;
                if (req.body.transfer_type == 'branch_to_branch') {
                    check = yield branch_to_branch(req.body.data);
                }
                if (req.body.transfer_type == 'warehouse_to_warehouse') {
                    check = yield warehouse_to_warehouse(req.body.data);
                }
                if (req.body.transfer_type == 'warehouse_to_branch') {
                    check = yield warehouse_to_branch(req.body.data);
                }
                if (req.body.transfer_type == 'branch_to_warehouse') {
                    check = yield branch_to_warehouse(req.body.data);
                }
                if (!check.status) {
                    return res.status(404).send(check);
                }
                let StockOutRes = yield database_1.StockOutTable.bulkCreate(req.body.data, { returning: true });
                let StockInRes;
                if (StockOutRes) {
                    StockInRes = yield database_1.StockInTable.bulkCreate(req.body.data, { returning: true });
                }
                return response_1.success(res, { stockOut: StockOutRes, stockIn: StockInRes });
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while saving stockout",
                    body: err.message
                });
            }
        });
    }
    stockIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield database_1.StockInTable.bulkCreate(req.body, { returning: true });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while saving stockIn",
                    body: err.message
                });
            }
        });
    }
    getstockOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                let sort = [];
                if (parseInt(query.filterbyFromBranch)) {
                    if ((query.from_branch_id == undefined) || (query.from_branch_id == null) || (query.from_branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass from_branch_id', data: {} });
                    }
                    let arr = query.from_branch_id.split(',');
                    wherequery.from_branch_id = arr;
                }
                if (parseInt(query.filterbyToBranch)) {
                    if ((query.to_branch_id == undefined) || (query.to_branch_id == null) || (query.to_branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass to_branch_id', data: {} });
                    }
                    let arr = query.to_branch_id.split(',');
                    wherequery.to_branch_id = arr;
                }
                if (parseInt(query.filterbyFromWarehouse)) {
                    if ((query.from_warehouse_id == undefined) || (query.from_warehouse_id == null) || (query.from_warehouse_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass from_warehouse_id', data: {} });
                    }
                    let arr = query.from_warehouse_id.split(',');
                    wherequery.from_warehouse_id = arr;
                }
                if (parseInt(query.filterbyToWarehouse)) {
                    if ((query.to_branch_id == undefined) || (query.to_branch_id == null) || (query.to_branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass to_branch_id', data: {} });
                    }
                    let arr = query.to_branch_id.split(',');
                    wherequery.to_branch_id = arr;
                }
                if (parseInt(query.filterbyToTransferType)) {
                    if ((query.transfer_type == undefined) || (query.transfer_type == null) || (query.transfer_type == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass transfer_type', data: {} });
                    }
                    let arr = query.transfer_type.split(',');
                    wherequery.transfer_type = arr;
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
                let response = yield database_1.StockOutTable.findAndCountAll({ where: wherequery,
                    include: [{ model: database_1.warehouse, as: "from_warehouse" },
                        { model: database_1.warehouse, as: "to_warehouse" },
                        { model: database_1.BranchTable, as: "from_branch" },
                        { model: database_1.BranchTable, as: "to_branch" },
                        { model: database_1.MasterItemTable }
                    ],
                    order: [sort],
                    limit: query.limit,
                    offset: query.offset,
                });
                // let from_branch:any=req.query.FromBranchid;
                // let to_branch:any=req.query.ToBranchid;
                // let fromdate:any=req.query.fromdate;
                // let todate:any=req.query.todate;
                // let limit:any=req.query.limt;
                // let offset:any=req.query.offset;
                // if(to_branch == undefined){
                //   let response:any= await StockOutTable.findAll(
                //     {where:{from_branch:from_branch},
                //     include: [{model: MasterItemTable}],
                //     order: [ [ 'stockout_id', 'DESC' ]],
                //     // [Op.between]: [fromdate, todate],
                //     limit : limit,
                //     offset: offset
                //     });
                //   return success(res, response);
                // }else{
                //   let response:any= await StockOutTable.findAll(
                //     {where:{from_branch:from_branch, branch:to_branch, 
                //       createdAt: {
                //       [Op.between]: [fromdate, todate]
                //     }},
                //     include: [{model: MasterItemTable}],
                //     order: [ [ 'stockout_id', 'DESC' ]],
                //     limit : limit,
                //     offset: offset
                //     });
                return response_1.success(res, response);
                // }
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while getting stockOut",
                    body: error.message
                });
            }
        });
    }
    getstockIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                let sort = [];
                if (parseInt(query.filterbyFromBranch)) {
                    if ((query.from_branch_id == undefined) || (query.from_branch_id == null) || (query.from_branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass from_branch_id', data: {} });
                    }
                    let arr = query.from_branch_id.split(',');
                    wherequery.from_branch_id = arr;
                }
                if (parseInt(query.filterbyToBranch)) {
                    if ((query.to_branch_id == undefined) || (query.to_branch_id == null) || (query.to_branch_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass to_branch_id', data: {} });
                    }
                    let arr = query.to_branch_id.split(',');
                    wherequery.to_branch_id = arr;
                }
                if (parseInt(query.filterbyFromWarehouse)) {
                    if ((query.from_warehouse_id == undefined) || (query.from_warehouse_id == null) || (query.from_warehouse_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass from_warehouse_id', data: {} });
                    }
                    let arr = query.from_warehouse_id.split(',');
                    wherequery.from_warehouse_id = arr;
                }
                if (parseInt(query.filterbyToWarehouse)) {
                    if ((query.to_warehouse_id == undefined) || (query.to_warehouse_id == null) || (query.to_warehouse_id == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass to_warehouse_id', data: {} });
                    }
                    let arr = query.to_warehouse_id.split(',');
                    wherequery.to_warehouse_id = arr;
                }
                if (parseInt(query.filterbyToTransferType)) {
                    if ((query.transfer_type == undefined) || (query.transfer_type == null) || (query.transfer_type == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass transfer_type', data: {} });
                    }
                    let arr = query.transfer_type.split(',');
                    wherequery.transfer_type = arr;
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
                let response = yield database_1.StockInTable.findAndCountAll({ where: wherequery,
                    include: [{ model: database_1.warehouse, as: "from_warehouse" },
                        { model: database_1.warehouse, as: "to_warehouse" },
                        { model: database_1.BranchTable, as: "from_branch" },
                        { model: database_1.BranchTable, as: "to_branch" },
                        { model: database_1.MasterItemTable }
                    ],
                    order: [sort],
                    limit: query.limit,
                    offset: query.offset,
                });
                //  let branch:any=req.query.Branch;
                //  let fromdate:any=req.query.fromdate;
                //  let todate:any=req.query.todate;
                //  let limit:any=req.query.limt;
                //  let offset:any=req.query.offset;
                // //  let to_branch=req.query.stockInfrom;
                //    let response:any= await StockInTable.findAll(
                //      {where:{
                //        branch:branch, 
                //       create: {
                //         [Op.between]: [fromdate, todate]
                //       }
                //     },
                //      include: [{model: MasterItemTable}],
                //      order: [ [ 'stockIn_id', 'DESC' ]],
                //      limit : limit,
                //      offset: offset
                //      });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while getting stockIn",
                    body: error.message
                });
            }
        });
    }
}
exports.stockController = stockController;
function branch_to_branch(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < body.length; i++) {
            let addQuantity = parseFloat(body[i].quantity);
            if (addQuantity != null || addQuantity > 0 || addQuantity != NaN) {
                let fromBranchWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, branch_id: body[i].from_branch_id, is_from_warehouse: false };
                let toBranchWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, branch_id: body[i].to_branch_id, is_from_warehouse: false };
                let FromBranchItem = yield database_1.StockDetailTable.findAll({ where: fromBranchWhere });
                let ToBranchItem = yield database_1.StockDetailTable.findAll({ where: toBranchWhere });
                if (FromBranchItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in From branch stock', data: fromBranchWhere };
                }
                if (ToBranchItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in To branch stock', data: toBranchWhere };
                }
                const reduceQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].quantity)}`) }, { where: fromBranchWhere, returning: true });
                const increaseQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].quantity)}`) }, { where: toBranchWhere, returning: true });
            }
            if (i == body.length - 1) {
                return { status: true };
            }
        }
    });
}
function warehouse_to_warehouse(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < body.length; i++) {
            let addQuantity = parseFloat(body[i].quantity);
            if (addQuantity != null || addQuantity > 0 || addQuantity != NaN) {
                let fromWarehouseWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, warehouse_id: body[i].from_warehouse_id, is_from_warehouse: true };
                let toWarehouseWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, warehouse_id: body[i].to_warehouse_id, is_from_warehouse: true };
                let FromWaehouseItem = yield database_1.StockDetailTable.findAll({ where: fromWarehouseWhere });
                let ToWarehouseItem = yield database_1.StockDetailTable.findAll({ where: toWarehouseWhere });
                if (FromWaehouseItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in From Warehouse stock', data: fromWarehouseWhere };
                }
                if (ToWarehouseItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in To Warehouse stock', data: toWarehouseWhere };
                }
                const reduceQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].quantity)}`) }, { where: fromWarehouseWhere, returning: true });
                const increaseQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].quantity)}`) }, { where: toWarehouseWhere, returning: true });
            }
            if (i == body.length - 1) {
                return { status: true };
            }
        }
    });
}
function warehouse_to_branch(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < body.length; i++) {
            let addQuantity = parseFloat(body[i].quantity);
            if (addQuantity != null || addQuantity > 0 || addQuantity != NaN) {
                let fromWarehouseWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, warehouse_id: body[i].from_warehouse_id, is_from_warehouse: true };
                let toBranchWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, branch_id: body[i].to_branch_id, is_from_warehouse: false };
                let FromWaehouseItem = yield database_1.StockDetailTable.findAll({ where: fromWarehouseWhere });
                let ToBranchItem = yield database_1.StockDetailTable.findAll({ where: toBranchWhere });
                if (FromWaehouseItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in From Warehouse stock', data: fromWarehouseWhere };
                }
                if (ToBranchItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in To Branch stock', data: toBranchWhere };
                }
                const reduceQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].quantity)}`) }, { where: fromWarehouseWhere, returning: true });
                const increaseQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].quantity)}`) }, { where: toBranchWhere, returning: true });
            }
            if (i == body.length - 1) {
                return { status: true };
            }
        }
    });
}
function branch_to_warehouse(body) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < body.length; i++) {
            let addQuantity = parseFloat(body[i].quantity);
            if (addQuantity != null || addQuantity > 0 || addQuantity != NaN) {
                let fromBranchWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, branch_id: body[i].from_branch_id, is_from_warehouse: false };
                let toWarehouseWhere = { item_id: body[i].item_id, brand_id: body[i].brand_id, warehouse_id: body[i].to_warehouse_id, is_from_warehouse: true };
                let FromBranchItem = yield database_1.StockDetailTable.findAll({ where: fromBranchWhere });
                let ToWarehouseItem = yield database_1.StockDetailTable.findAll({ where: toWarehouseWhere });
                if (FromBranchItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in From Branch stock', data: fromBranchWhere };
                }
                if (ToWarehouseItem.length == 0) {
                    return { status: false, type: 'Not-Found', message: 'item id not found in To Warehouse stock', data: toWarehouseWhere };
                }
                const reduceQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${parseFloat(body[i].quantity)}`) }, { where: fromBranchWhere, returning: true });
                const increaseQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].quantity)}`) }, { where: toWarehouseWhere, returning: true });
            }
            if (i == body.length - 1) {
                return { status: true };
            }
        }
    });
}
//# sourceMappingURL=stockController.js.map