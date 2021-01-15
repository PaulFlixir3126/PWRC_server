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
exports.grvController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class grvController {
    grvData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let voucherCode;
                req.body.is_from_warehouse = false;
                const { branch_id, invoice_no } = req.body;
                response = yield database_1.GrvTable.findOne({
                    where: { branch_id: branch_id, invoice_no: invoice_no },
                    raw: true
                });
                if (response) {
                    return next({ message: "Duplicate invoice number" });
                }
                response = yield database_1.GrvTable.findAll({
                    where: { branch_id: branch_id },
                    raw: true
                });
                if (branch_id.toString().length == 1) {
                    voucherCode = "GRV-0";
                }
                else {
                    voucherCode = "GRV-";
                }
                if (response.length == 0) {
                    req.body.goods_received_voucher =
                        voucherCode + branch_id + "-" + "0001";
                }
                else {
                    response.sort((a, b) => +b.stock_id - +a.stock_id);
                    let code = response;
                    let codeValue = code[0].goods_received_voucher.slice(-4);
                    let tempcodeValue = parseInt(codeValue) + 1;
                    let tempCode = tempcodeValue.toString();
                    if (tempCode.length == 1) {
                        req.body.goods_received_voucher =
                            voucherCode + branch_id + "-" + "000" + tempCode;
                    }
                    if (tempCode.length == 2) {
                        req.body.goods_received_voucher =
                            voucherCode + branch_id + "-" + "00" + tempCode;
                    }
                    if (tempCode.length == 3) {
                        req.body.goods_received_voucher =
                            voucherCode + branch_id + "-" + "0" + tempCode;
                    }
                    if (tempCode.length >= 4) {
                        req.body.goods_received_voucher =
                            voucherCode + branch_id + "-" + tempCode;
                    }
                }
                console.log("req.body", req.body);
                response = yield database_1.GrvTable.create(req.body);
                updateStockDetails(req.body.stock_data);
                updategrvItemTable(response);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: err.message,
                    body: err
                });
            }
        });
    }
    returnGrvData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id, brand_id } = req.query;
                let response;
                if (id) {
                    let wherequery = {};
                    wherequery.branch_id = id;
                    if (req.query.fromdate && req.query.todate) {
                        wherequery['createdAt'] = { [database_1.Op.between]: [req.query.fromdate, req.query.todate] };
                    }
                    response = yield database_1.GrvTable.findAll({
                        where: wherequery,
                        include: [
                            {
                                model: database_1.BranchTable,
                                attributes: ["branch_name"],
                                include: [
                                    {
                                        model: database_1.BrandTable,
                                        attributes: ["brand_name", "brand_id"]
                                    }
                                ]
                            },
                            { model: database_1.SupplierTable }
                        ]
                    });
                    response.sort((a, b) => +b.stock_id - +a.stock_id);
                    return response_1.success(res, response);
                }
                let wherequery = {};
                if (req.query.fromdate && req.query.todate) {
                    wherequery['createdAt'] = { [database_1.Op.between]: [req.query.fromdate, req.query.todate] };
                }
                response = yield database_1.GrvTable.findAll({
                    where: wherequery,
                    include: [
                        {
                            model: database_1.BranchTable,
                            attributes: ["branch_name"],
                            include: [
                                {
                                    model: database_1.BrandTable,
                                    attributes: ["brand_name", "brand_id"]
                                }
                            ]
                        },
                        { model: database_1.SupplierTable }
                    ]
                });
                response.sort((a, b) => +b.stock_id - +a.stock_id);
                // var flags: any = {};
                // var newPlaces = response.filter(function(entry: any) {
                // 	if (flags[entry.branch_id]) {
                // 		return false;
                // 	}
                // 	flags[entry.branch_id] = true;
                // 	return true;
                // });
                // let group_to_values: any = newPlaces.reduce(function(obj: any, item: any) {
                // 	obj[item.branch.brand.brand_name] = obj[item.branch.brand.brand_name] || [];
                // 	obj[item.branch.brand.brand_name].push(item);
                // 	return obj;
                // }, {});
                // let groups: any = Object.keys(group_to_values).map(function(key: any) {
                // 	return { brand_name: key, branch_data: group_to_values[key] };
                // });
                let filter;
                filter = yield new Promise(resolve => {
                    resolve(response.filter((r) => {
                        return r.branch.brand.brand_id == brand_id;
                    }));
                });
                return response_1.success(res, filter);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while fetching  data",
                    body: err
                });
            }
        });
    }
    WarehousegrvData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let voucherCode;
                req.body.is_from_warehouse = true;
                const { warehouse_id, invoice_no } = req.body;
                response = yield database_1.GrvTable.findOne({
                    where: { branch_id: warehouse_id, invoice_no: invoice_no },
                    raw: true
                });
                if (response) {
                    return next({ message: "Duplicate invoice number" });
                }
                response = yield database_1.GrvTable.findAll({
                    where: { warehouse_id: warehouse_id },
                    raw: true
                });
                if (warehouse_id.toString().length == 1) {
                    voucherCode = "GRV-0";
                }
                else {
                    voucherCode = "GRV-";
                }
                if (response.length == 0) {
                    req.body.goods_received_voucher =
                        voucherCode + warehouse_id + "-" + "0001";
                }
                else {
                    response.sort((a, b) => +b.stock_id - +a.stock_id);
                    let code = response;
                    let codeValue = code[0].goods_received_voucher.slice(-4);
                    let tempcodeValue = parseInt(codeValue) + 1;
                    let tempCode = tempcodeValue.toString();
                    if (tempCode.length == 1) {
                        req.body.goods_received_voucher =
                            voucherCode + warehouse_id + "-" + "000" + tempCode;
                    }
                    if (tempCode.length == 2) {
                        req.body.goods_received_voucher =
                            voucherCode + warehouse_id + "-" + "00" + tempCode;
                    }
                    if (tempCode.length == 3) {
                        req.body.goods_received_voucher =
                            voucherCode + warehouse_id + "-" + "0" + tempCode;
                    }
                    if (tempCode.length >= 4) {
                        req.body.goods_received_voucher =
                            voucherCode + warehouse_id + "-" + tempCode;
                    }
                }
                response = yield database_1.GrvTable.create(req.body);
                WarehouseupdateStockDetails(req.body.stock_data);
                WarehouseupdategrvItemTable(response);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: err.message,
                    body: err
                });
            }
        });
    }
}
exports.grvController = grvController;
function updateStockDetails(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("grv dddddddddddddd", data);
        for (let i = 0; i < data.length; i++) {
            let checkBrand_Branch = yield database_1.StockDetailTable.findAll({
                where: { brand_id: data[i].brand_id, branch_id: data[i].branch_id, item_id: data[i].item_id, is_from_warehouse: false }
            });
            let parseresult = JSON.parse(JSON.stringify(checkBrand_Branch));
            console.log("grv-parseresult==", parseresult);
            console.log("grv-data[i]", data[i]);
            if (parseresult.length > 0) {
                const updateqty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${parseFloat(data[i].quantity)}`) }, {
                    where: {
                        item_code: data[i].item_number,
                        brand_id: data[i].brand_id,
                        branch_id: data[i].branch_id,
                        item_id: data[i].item_id,
                        is_from_warehouse: false
                    },
                    returning: true
                });
                console.log("updateqty", updateqty);
            }
            else {
                let obj = { item_code: data[i].item_number,
                    brand_id: data[i].brand_id,
                    branch_id: data[i].branch_id,
                    item_id: data[i].item_id,
                    quantity: data[i].quantity,
                    item_name_english: data[i].item_name,
                    item_name_arabic: data[i].item_name_arabic,
                    category_code: data[i].category_code
                };
                //  let createNewdata = await StockDetailTable.create(<any>obj);
            }
        }
    });
}
function WarehouseupdateStockDetails(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("warehouse dddddddddddddd", data);
        for (let i = 0; i < data.length; i++) {
            let checkBrand_Branch = yield database_1.StockDetailTable.findAll({
                where: { brand_id: data[i].brand_id, warehouse_id: data[i].warehouse_id, item_id: data[i].item_id, is_from_warehouse: true }
            });
            let parseresult = JSON.parse(JSON.stringify(checkBrand_Branch));
            console.log("warehouse-parseresult==", parseresult);
            console.log("warehouse-data[i]", data[i]);
            if (parseresult.length > 0) {
                const updateqty = yield database_1.StockDetailTable.update({ quantity: database_1.sequelize.literal(`quantity + ${data[i].quantity}`) }, {
                    where: {
                        item_code: data[i].item_number,
                        brand_id: data[i].brand_id,
                        warehouse_id: data[i].warehouse_id,
                        item_id: data[i].item_id
                    },
                    returning: true
                });
                console.log("updateqty==", updateqty);
            }
            else {
                let obj = { item_code: data[i].item_number,
                    brand_id: data[i].brand_id,
                    branch_id: data[i].branch_id,
                    item_id: data[i].item_id,
                    quantity: data[i].quantity,
                    item_name_english: data[i].item_name,
                    item_name_arabic: data[i].item_name_arabic,
                    category_code: data[i].category_code
                };
                //  let createNewdata = await StockDetailTable.create(<any>obj);
            }
        }
    });
}
function updategrvItemTable(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let grvdata = JSON.parse(JSON.stringify(data));
        for (let j = 0; j < grvdata.stock_data.length; j++) {
            let obj = {
                stock_id: grvdata.stock_id,
                item_id: grvdata.stock_data[j].item_id,
                item_name: grvdata.stock_data[j].item_name,
                quantity: grvdata.stock_data[j].quantity,
                unitprice: grvdata.stock_data[j].unit_price,
                branch_id: grvdata.stock_data[j].branch_id,
                brand_id: grvdata.stock_data[j].brand_id,
                is_from_warehouse: false
            };
            let grvItemsadd = yield database_1.grvItems.create(obj);
            // updateUnitpriceinMasterTable();
            updateUnitpriceinStockDetails();
        }
    });
}
function WarehouseupdategrvItemTable(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let grvdata = JSON.parse(JSON.stringify(data));
        for (let j = 0; j < grvdata.stock_data.length; j++) {
            let obj = {
                stock_id: grvdata.stock_id,
                item_id: grvdata.stock_data[j].item_id,
                item_name: grvdata.stock_data[j].item_name,
                quantity: grvdata.stock_data[j].quantity,
                unitprice: grvdata.stock_data[j].unit_price,
                warehouse_id: grvdata.stock_data[j].warehouse_id,
                brand_id: grvdata.stock_data[j].brand_id,
                is_from_warehouse: true
            };
            let grvItemsadd = yield database_1.grvItems.create(obj);
            // WarehouseupdateUnitpriceinMasterTable();
            WarehouseupdateUnitpriceinStockDetails();
        }
    });
}
function updateUnitpriceinMasterTable() {
    return __awaiter(this, void 0, void 0, function* () {
        let UpdateMasteritemPrice = yield database_1.sequelize.query(`UPDATE masteritems m
  SET last_price= f.valsum,
   average_price = f.valsum
  FROM 
  (
    SELECT item_id, AVG(unitprice) valsum
    FROM grvitems
    GROUP BY  item_id 
  ) f
  WHERE m.item_id = f.item_id`);
        console.log("UpdateMasteritemPrice", UpdateMasteritemPrice);
    });
}
function updateUnitpriceinStockDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        let UpdateStockPrice = yield database_1.sequelize.query(`UPDATE stockdetails m
  SET last_price= f.valsum,
   average_price = f.valsum
  FROM
  (
    SELECT item_id, is_from_warehouse, AVG(unitprice) valsum
    FROM grvitems
    GROUP BY  item_id,is_from_warehouse
  ) f
  WHERE m.item_id = f.item_id  and
  m.is_from_warehouse = f.is_from_warehouse`);
        console.log("UpdateMasteritemPrice", UpdateStockPrice);
    });
}
function WarehouseupdateUnitpriceinMasterTable() {
    return __awaiter(this, void 0, void 0, function* () {
        let UpdateMasteritemPrice = yield database_1.sequelize.query(`UPDATE masteritems m
  SET last_price= f.valsum,
   average_price = f.valsum
  FROM 
  (
    SELECT item_id, AVG(unitprice) valsum
    FROM grvitems
    GROUP BY  item_id 
  ) f
  WHERE m.item_id = f.item_id`);
        console.log("UpdateMasteritemPrice", UpdateMasteritemPrice);
    });
}
function WarehouseupdateUnitpriceinStockDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        let UpdateStockPrice = yield database_1.sequelize.query(`UPDATE stockdetails m
  SET last_price= f.valsum,
   average_price = f.valsum
  FROM 
  (
    SELECT item_id, is_from_warehouse,AVG(unitprice) valsum
    FROM grvitems
    GROUP BY  item_id ,is_from_warehouse
  ) f
  WHERE m.item_id = f.item_id and
  m.is_from_warehouse = f.is_from_warehouse`);
        console.log("UpdateMasteritemPrice", UpdateStockPrice);
    });
}
function updateMasterItemQty(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let finaloutput = [];
        for (let i = 0; i < data.length; i++) {
            let response = yield database_1.MasterItemTable.find({
                where: { item_code: data[i].item_number }
            });
            let itemRes = JSON.parse(JSON.stringify(response));
            let addQuantity = itemRes.quantity + parseFloat(data[i].quantity);
            let check = {
                item_code: data[i].item_number,
                previousqty: itemRes.quantity,
                supplyqty: data[i].quantity,
                finalqty: addQuantity
            };
            if (addQuantity != null || addQuantity >= 0 || addQuantity != NaN) {
                const updateqty = yield database_1.MasterItemTable.update({ quantity: addQuantity }, {
                    where: { item_code: data[i].item_number },
                    returning: true
                });
                finaloutput.push(check);
            }
            if (i == data.length - 1) {
                console.log("finish updating qty", finaloutput);
                let finalres = {
                    message: "quantity updated successfully",
                    data: finaloutput
                };
            }
        }
    });
}
//# sourceMappingURL=grvController.js.map