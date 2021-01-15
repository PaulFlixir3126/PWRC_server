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
exports.givController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class givController {
    addGiv(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield database_1.givTable.bulkCreate(req.body, { returning: true });
                let reducedStockQty = yield updateStockdetails(response); //reduce warehouse qty
                return response_1.success(res, { savedGiv: response, reducedWareHouseItem: reducedStockQty });
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while saving giv details",
                    body: error.message
                });
            }
        });
    }
    getGiv(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let wherequery = {};
                let sort = [];
                if (parseInt(query.filterbystatus)) {
                    if ((query.status == undefined) || (query.status == null) || (query.status == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass order_id', data: {} });
                    }
                    wherequery.status = query.status;
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
                if (query.transaction_date) {
                    if ((query.transaction_date == undefined) || (query.transaction_date == null) || (query.transaction_date == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass transaction_date', data: {} });
                    }
                    wherequery['transaction_date'] = query.transaction_date;
                }
                if (query.sortBy == 'item_id' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.MasterItemTable, 'item_id', query.sortType];
                }
                if (query.sortBy == 'item_name_english' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.MasterItemTable, 'item_name_english', query.sortType];
                }
                if (query.sortBy == 'item_name_arabic' && query.sortType) {
                    if ((query.sortType == undefined) || (query.sortType == null) || (query.sortType == "")) {
                        return res.status(400).send({ status: false, type: 'invalidRequest', message: 'please pass sortType ASC,DESC', data: {} });
                    }
                    sort = [database_1.MasterItemTable, 'item_name_arabic', query.sortType];
                }
                if (!query.sortBy || !query.sortType) {
                    sort = ['updatedAt', 'DESC'];
                }
                let response = yield database_1.givTable.findAndCountAll({
                    where: wherequery,
                    include: [{ model: database_1.StockDetailTable }, { model: database_1.BrandTable }, { model: database_1.BranchTable }, { model: database_1.MasterItemTable }, { model: database_1.warehouse }],
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
    confirm_issued_item(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body = req.body;
                let finaloutput = [];
                let givUpdate = [];
                for (let i = 0; i < body.length; i++) {
                    const confirmQty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(body[i].issued_qty)}`) }, {
                        where: { branch_id: body[i].branch_id, item_id: body[i].item_id, is_from_warehouse: false },
                        returning: true
                    });
                    let parseresult = JSON.parse(JSON.stringify(confirmQty));
                    if (parseresult[0] == 0) {
                        return res.status(404).send({ status: false, type: 'NotFound', message: 'stock_detail_id notfound', data: body[i].stock_detail_id });
                    }
                    finaloutput.push(parseresult[1]);
                    const updateGivStatus = yield database_1.givTable.update({ status: 'confirmed' }, {
                        where: { giv_id: body[i].giv_id },
                        returning: true
                    });
                    givUpdate.push(updateGivStatus);
                    if (i == body.length - 1) {
                        let finalres = {
                            message: "stockdetail quantity updated successfully",
                            data: finaloutput
                        };
                        return response_1.success(res, { stockdetails: finalres, givUpdate: givUpdate });
                    }
                }
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while confirming giv",
                    body: error.message
                });
            }
        });
    }
}
exports.givController = givController;
function updateStockdetails(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let a = [];
        for (let i = 0; i < data.length; i++) {
            let checkBrand_Branch = yield database_1.StockDetailTable.findAll({
                where: { brand_id: data[i].brand_id, warehouse_id: data[i].warehouse_id, item_id: data[i].item_id, is_from_warehouse: true }
            });
            let parseresult = JSON.parse(JSON.stringify(checkBrand_Branch));
            if (parseresult.length > 0) {
                const updateqty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity - ${data[i].issued_qty}`) }, {
                    where: {
                        stock_detail_id: data[i].stock_detail_id,
                        is_from_warehouse: true,
                    },
                    returning: true
                });
                a.push(updateqty);
                if (i == data.length - 1) {
                    return a;
                }
            }
        }
    });
}
//# sourceMappingURL=givController.js.map