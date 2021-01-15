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
exports.foodcostController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class foodcostController {
    // 	select stockdetails.stock_detail_id,
    // stockdetails.item_name_english as stockItem,
    // wastages.item_id as wastageItem,
    // stockouts.item_id as stockoutItem,
    // stockcounts.item_id as stockcountsItem,
    // stockdetails.item_id as stockItemId,
    //  stockdetails.brand_id as stockBranId,
    //  stockdetails.branch_id as stockBranchId,
    //  stockouts.item_id as stockoutsItem,
    //  sum(stockouts.quantity) as totalstockout,
    //  sum("countedQty") as totalcount,
    //  sum("wastageQty") as totalWastageQty
    // 	 from stockdetails
    // 	left  join wastages
    //  on stockdetails.item_id = wastages.item_id
    //    left join stockouts
    // 	on stockdetails.item_id=stockouts.item_id
    // 	left join stockcounts
    // 	on stockdetails.item_id=stockcounts.item_id
    // 	 where wastages.brand_id=2 and wastages.branch_id=2 and stockdetails.brand_id=2 and stockdetails.branch_id=2
    // 	 and stockouts.brand_id=2 and stockouts.branch_id=2  and stockcounts.brand_id=2 and stockcounts.branch_id=2
    // 	 and  stockcounts.stockcountdate >='2020-03-13 05:30:00+05:30' AND stockcounts.stockcountdate <='2020-03-16 05:30:00+05:30'
    // 	 group by stockdetails.stock_detail_id,wastages.item_id,stockouts.item_id,stockcounts.item_id
    // select stockdetails.stock_detail_id,stockdetails.item_id,stockdetails.brand_id as stockBranId,
    // stockdetails.branch_id as stockBranchId,
    // wastages.remarks from stockdetails
    //  join wastages
    // on stockdetails.item_id = wastages.item_id
    // 	where stockdetails.brand_id=2 and stockdetails.branch_id=2
    // select stockdetails.stock_detail_id,
    // stockdetails.item_id as stockItem,
    // stockdetails.brand_id as stockBranId,
    // stockdetails.branch_id as stockBranchId,
    //  wastages.item_id as wastageItem,
    //  wastages.remarks from stockdetails
    //   join wastages
    //  on stockdetails.item_id = wastages.item_id
    //  	where stockdetails.brand_id=2 and stockdetails.branch_id=2
    foodcost1(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // response = await sequelize.query(`
                // select item_id, sum("wastageQty") as totalWastageQty
                // from wastages
                // where "createdAt" between '2020-02-01 00:00:00' and '2020-02-28 23:59:59'
                // group by item_id`);
                // console.log("response",response)
                // 	let test=await StockDetailTable.findAll({
                // 		include:[{model:WastageTable}],
                // 		// attributes: {
                // 		// 	include: [sequelize.literal(`select item_id, sum("wastageQty") as totalWastageQty from wastages where brand_id=2 and branch_id=4 group by item_id`)] }
                // });
                // let	response = await sequelize.query(`select c.item_id,c.item_name_english, sum("p.wastageQty") as sumprice
                // from stockdetails c
                // left join wastages p
                // on c.item_id = p.item_id
                // where brand_id=2 and branch_id=2
                // group by item_id`);
                // 	let	response = await WastageTable.findAll({
                // 		where:{brand_id:2,branch_id:2},
                //     attributes: ['item_id', [sequelize.fn('sum', sequelize.col('wastageQty')), 'total_cost']],
                //     include: [
                //     {
                //         model: StockDetailTable,
                // 				attributes: ['item_name_english']
                //     }
                //     ],
                //     group: ['wastage.item_id','stockdetail.stock_detail_id']
                // })
                let response = yield database_1.StockDetailTable.findAll({
                    where: { brand_id: 2, branch_id: 2 },
                    attributes: ["stock_detail_id", "item_name_english", "item_id"]
                });
                let stockdetail = JSON.parse(JSON.stringify(response));
                console.log("--------", stockdetail);
                let wastage = yield database_1.sequelize.query(`select stockdetails.stock_detail_id,
stockdetails.item_name_english as stockItem,
wastages.item_id as wastageItem,
stockdetails.item_id as stockItemId,
 stockdetails.brand_id as stockBranId,
 stockdetails.branch_id as stockBranchId,
 sum("wastageQty") as totalWastageQty
	 from stockdetails
	 join wastages 
 on stockdetails.item_id = wastages.item_id
	 where wastages.brand_id=2 and wastages.branch_id=2 and stockdetails.brand_id=2 and stockdetails.branch_id=2
	 group by stockdetails.stock_detail_id,wastages.item_id`);
                let stockouts = yield database_1.sequelize.query(` select stockdetails.item_id as stockItem, 
	 stockouts.item_id as stockoutsItem, sum(stockouts.quantity) as total
	from stockdetails
	 join stockouts on stockdetails.item_id=stockouts.item_id
	 where stockouts.brand_id=2 and stockouts.branch_id=2 and
	 stockdetails.brand_id=2 and stockdetails.branch_id=2
	group by stockdetails.item_id,stockouts.item_id`);
                console.log("wastagesssssss", wastage[0]);
                console.log("stockoutssssssss", stockouts[0]);
                let obj = {
                    stockdetail: response,
                    wastage: wastage[0],
                    stockouts: stockouts[0]
                };
                for (let i = 0; i < stockdetail.length; i++) {
                    for (let j = 0; j < wastage[0].length; j++) {
                        if (stockdetail[i].stock_detail_id ==
                            wastage[0][j].stock_detail_id) {
                            stockdetail[i].totalwastage = wastage[0][j].totalwastageqty;
                        }
                        else {
                            stockdetail[i].totalwastage = null;
                        }
                    }
                }
                return response_1.success(res, stockdetail);
                // return success(res, response);
            }
            catch (err) {
                console.log("eeeeee", err);
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: err.message
                });
            }
        });
    }
    recipetest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let totalsalescount = yield database_1.salesCountTable.findAll({
                    attributes: ["menu_id", "menu_name",
                        [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalsales"]],
                    group: ["menu_id", "menu_name"]
                });
                // let MenuRecipe1 = await MenuRecipe.findAll({
                //   attributes: ["item_id",
                //   [sequelize.fn("sum", sequelize.col("quantity")), "totalMenuRecipe"]],
                //      group: ["item_id"]
                // });
                let MenuRecipe1 = yield database_1.MenuRecipe.findAll({});
                let ItemRecipe1 = yield database_1.ItemRecipe.findAll({
                    attributes: ["item_id", [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalItemRecipe"]],
                    group: ["item_id"]
                });
                let ItemRecipe11 = JSON.parse(JSON.stringify(ItemRecipe1));
                let MenuRecipe11 = JSON.parse(JSON.stringify(MenuRecipe1));
                let totalsalescount1 = JSON.parse(JSON.stringify(totalsalescount));
                console.log("xxxxxxxxxxxxxxx", totalsalescount1);
                console.log("xxxxxxxxxxxxxxxMenuRecipe1", MenuRecipe11);
                console.log("xxxxxxxxxxxxxxxItemRecipe11", ItemRecipe11);
                for (let i = 0; i < totalsalescount1.length; i++) {
                    for (let j = 0; j < MenuRecipe11.length; j++) {
                        if (totalsalescount1[i].menu_id == MenuRecipe11[j].menu_id) {
                            MenuRecipe11[j].quantity = parseFloat(MenuRecipe11[j].quantity) * parseFloat(totalsalescount1[i].totalsales);
                        }
                    }
                }
                console.log("aaaaaaaaaaaaaaaaaaaaa", MenuRecipe11);
                let result = [];
                MenuRecipe11.reduce(function (res, value) {
                    if (!res[value.item_id]) {
                        res[value.item_id] = { item_id: value.item_id, quantity: 0 };
                        result.push(res[value.item_id]);
                    }
                    res[value.item_id].quantity += value.quantity;
                    return res;
                }, {});
                console.log("xxxxxxxxx", result);
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < ItemRecipe11.length; j++) {
                        if (result[i].item_id == ItemRecipe11[j].item_id) {
                            result[i].quantity = result[i].quantity + ItemRecipe11[j].totalItemRecipe;
                        }
                    }
                }
                console.log("fffffffffff", MenuRecipe11);
                console.log("yyyyyyyyyy", result);
                return response_1.success(res, result);
            }
            catch (error) {
                console.log("eeeeee", error);
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: error.message
                });
            }
        });
    }
    test(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let todate = req.query.todate;
                let fromdate = req.query.fromdate;
                let brand_id = req.query.brand_id;
                let branch_id = req.query.branch_id;
                /**get items from stockdetails based on brand branch */
                let stockdetails = yield database_1.StockDetailTable.findAll({
                    where: { brand_id: brand_id, branch_id: branch_id },
                    attributes: ["stock_detail_id", "item_name_english", "item_id", "average_price", "item_code"]
                    // limit:limit,
                    // offset:offset
                });
                /**get sum of wastege qty of item based on dates brand branch */
                let wastage = yield database_1.WastageTable.findAll({
                    where: { brand_id: brand_id, branch_id: branch_id,
                        createdAt: { [database_1.Op.between]: [fromdate, todate] }
                    },
                    attributes: ["item_id", "stock_detail_id", "createdAt",
                        [database_1.sequelize.fn("sum", database_1.sequelize.col("wastageQty")), "totalwastageqty"]],
                    group: ["wastage.item_id", "wastage.stock_detail_id", "createdAt"]
                });
                /**get sum of stockout qty of item based on dates brand branch */
                let stockout = yield database_1.StockOutTable.findAll({
                    where: { brand_id: brand_id, from_branch_id: branch_id,
                        createdAt: { [database_1.Op.between]: [fromdate, todate] }
                    },
                    attributes: ["item_id", "stock_detail_id", [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalstockout"]],
                    group: ["item_id", "stock_detail_id"]
                });
                /**get sum of stockin qty of item based on dates brand branch */
                let stockin = yield database_1.StockInTable.findAll({
                    where: { brand_id: brand_id, to_branch_id: branch_id,
                        createdAt: { [database_1.Op.between]: [fromdate, todate] }
                    },
                    attributes: ["item_id", "stock_detail_id", [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalstockin"]],
                    group: ["item_id", "stock_detail_id"]
                });
                /**get sum of grv items qty of item based on dates brand branch */
                // let grvTable = await GrvTable.findAll({
                // 	where:{branch_id:branch_id,
                // 		createdAt: {[Op.between]: [fromdate, todate]}}
                // });
                // grvTable.sort((a: any, b: any) => +b.stock_id - +a.stock_id);
                // let grvtableres = JSON.parse(JSON.stringify(grvTable));
                // let itemwithquantity = [];
                // for (let i = 0; i < grvtableres.length; i++) {
                //   for (let j = 0; j < grvtableres[i].stock_data.length; j++) {
                //     let obj = {
                //       stock_id: grvtableres[i].stock_id,
                //       item_code: grvtableres[i].stock_data[j].item_number,
                //       item_name: grvtableres[i].stock_data[j].item_name,
                //       quntity: grvtableres[i].stock_data[j].quantity
                //     };
                //     itemwithquantity.push(obj);
                //   }
                // }
                // var map = itemwithquantity.reduce(function(map: any, e: any) {
                //   map[e.item_code] = +e.quntity + (map[e.item_code] || 0);
                //   return map;
                // }, {});
                // var result = Object.keys(map).map(function(k) {
                //   return { item_code: k, quntity: map[k].toFixed(3) };
                // });
                let grvitems = yield database_1.grvItems.findAll({
                    where: { brand_id: brand_id, branch_id: branch_id, createdAt: { [database_1.Op.between]: [fromdate, todate] } },
                    attributes: ["item_id", [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalgrvQty"]],
                    group: ["item_id"]
                });
                /** get opening stock from stock count based on brand,branch, fromdate*/
                let fD = new Date(fromdate).toISOString().split("T")[0];
                let tD = new Date(todate).toISOString().split("T")[0];
                let stockcountOpenings = yield database_1.sequelize.query(`select * from "stockcounts"
                where brand_id=${brand_id} and branch_id=${branch_id} and stockcountdate='${fD} 05:30:00+05:30' and status='confirm'`);
                /**get actual stock of item based on brand branch todate */
                let stockActualstockTodate = yield database_1.sequelize.query(`select * from "stockcounts"
                  where brand_id=${brand_id} and branch_id=${branch_id} and stockcountdate='${tD} 05:30:00+05:30' and status='confirm'`);
                /**get total sales count of menu from salescount table based on brand branch dates */
                let totalsalescount = yield database_1.salesCountTable.findAll({
                    where: { branch_id: branch_id, brand_id: brand_id, segment: 'take_out',
                        createdAt: { [database_1.Op.between]: [fromdate, todate] } },
                    attributes: ["menu_id", "menu_name", [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalsales"]],
                    group: ["menu_id", "menu_name"]
                });
                /**get total sales count of menu from salescount table based on brand branch dates only dinein */
                let totalsalescountDineIn = yield database_1.salesCountTable.findAll({
                    where: { branch_id: branch_id, brand_id: brand_id, segment: 'dine_in',
                        createdAt: { [database_1.Op.between]: [fromdate, todate] } },
                    attributes: ["menu_id", "menu_name", "segment", "package_type", [database_1.sequelize.fn("sum", database_1.sequelize.col("quantity")), "totalsales"]],
                    group: ["menu_id", "menu_name", "segment", "package_type"]
                });
                /**get menu recipe based on brand dates */
                let MenuRecipe1 = yield database_1.MenuRecipe.findAll({
                    where: { brand_id: brand_id, createdAt: { [database_1.Op.between]: [fromdate, todate] } },
                    include: [{ model: database_1.ItemMasterrecipeTable,
                            include: [{ model: database_1.ItemRecipe }] }]
                });
                /**get item recippe based oon brand, dates */
                let ItemRecipe1 = yield database_1.ItemRecipe.findAll({
                    where: { brand_id: brand_id, createdAt: { [database_1.Op.between]: [fromdate, todate] } }
                });
                // let ItemRecipe1 = await ItemRecipe.findAll({
                //   where:{brand_id:brand_id,createdAt: {[Op.between]: [fromdate, todate]}},
                //   attributes: ["item_id", [sequelize.fn("sum", sequelize.col("quantity")), "totalItemRecipe"]],
                //   group: ["item_id"]
                // });
                let ItemRecipe11 = JSON.parse(JSON.stringify(ItemRecipe1));
                let MenuRecipe11 = JSON.parse(JSON.stringify(MenuRecipe1));
                let totalsalescount1 = JSON.parse(JSON.stringify(totalsalescount));
                let totalsalescountDine_in = JSON.parse(JSON.stringify(totalsalescountDineIn));
                let idealstock = [];
                console.log("totalsalescount1", totalsalescount1);
                console.log("totalsalescountDine_in", totalsalescountDine_in);
                console.log("MenuRecipe11", MenuRecipe11);
                console.log("ItemRecipe11", ItemRecipe11);
                /**multiply salescount * menu recipe qty and add extra object sales count in each menu recipe */
                if (totalsalescountDine_in.length > 0 || totalsalescount1.length > 0) {
                    for (let i = 0; i < totalsalescountDine_in.length; i++) {
                        for (let j = 0; j < MenuRecipe11.length; j++) {
                            if (totalsalescountDine_in[i].menu_id == MenuRecipe11[j].menu_id) {
                                if ((MenuRecipe11[j].package_Type == 'No')) {
                                    MenuRecipe11[j].quantity = parseFloat(MenuRecipe11[j].quantity) * parseFloat(totalsalescountDine_in[i].totalsales);
                                    MenuRecipe11[j]['salescount'] = parseFloat(totalsalescountDine_in[i].totalsales);
                                }
                            }
                        }
                    }
                    for (let i = 0; i < totalsalescount1.length; i++) {
                        for (let j = 0; j < MenuRecipe11.length; j++) {
                            if (totalsalescount1[i].menu_id == MenuRecipe11[j].menu_id) {
                                // if((MenuRecipe11[j].package_Type =='Yes' )){
                                console.log("parseFloat(MenuRecipe11[j].quantity) * parseFloat(totalsalescount1[i].totalsales)", parseFloat(MenuRecipe11[j].quantity) * parseFloat(totalsalescount1[i].totalsales));
                                MenuRecipe11[j].quantity = parseFloat(MenuRecipe11[j].quantity) * parseFloat(totalsalescount1[i].totalsales);
                                MenuRecipe11[j]['salescount'] = parseFloat(totalsalescount1[i].totalsales);
                                // }
                                console.log("!!!!!!!!!!MenuRecipe11[j]", MenuRecipe11[j]);
                            }
                        }
                    }
                    console.log("MenuRecipe1122222222", MenuRecipe11);
                    /**multiply sales count * item recipe qty and push in an array */
                    let itemrecipearr = [];
                    for (let i = 0; i < MenuRecipe11.length; i++) {
                        if (MenuRecipe11[i].itemmasterrecipe != null) {
                            for (let j = 0; j < MenuRecipe11[i].itemmasterrecipe.itemrecipes.length; j++) {
                                MenuRecipe11[i].itemmasterrecipe.itemrecipes[j].quantity = MenuRecipe11[i].itemmasterrecipe.itemrecipes[j].quantity * MenuRecipe11[i].salescount;
                                itemrecipearr.push(MenuRecipe11[i].itemmasterrecipe.itemrecipes[j]);
                            }
                        }
                    }
                    console.log("ITEMMMMMMMMMMMM1122222222", itemrecipearr);
                    /**group menu recipe item based on items and add the total item qty push in idealstock array*/
                    MenuRecipe11.reduce(function (res, value) {
                        if (!res[value.item_id]) {
                            res[value.item_id] = { item_id: value.item_id, quantity: 0 };
                            idealstock.push(res[value.item_id]);
                        }
                        res[value.item_id].quantity += value.quantity;
                        return res;
                    }, {});
                    console.log("222222222222", idealstock);
                    /** add the menurecipe item qty and itemrecipe item qty  */
                    for (let i = 0; i < idealstock.length; i++) {
                        for (let j = 0; j < itemrecipearr.length; j++) {
                            if (idealstock[i].item_id == itemrecipearr[j].masterItem_id) {
                                idealstock[i].quantity = idealstock[i].quantity + itemrecipearr[j].quantity;
                            }
                        }
                    }
                }
                let stockdetail = JSON.parse(JSON.stringify(stockdetails));
                let wastages = JSON.parse(JSON.stringify(wastage));
                let stockouts = JSON.parse(JSON.stringify(stockout));
                let stockins = JSON.parse(JSON.stringify(stockin));
                let grvTotal = JSON.parse(JSON.stringify(grvitems));
                let stockcountsOpening = JSON.parse(JSON.stringify(stockcountOpenings[0]));
                let stockcountsclose = JSON.parse(JSON.stringify(stockActualstockTodate[0]));
                console.log("stockdetail--", stockdetail);
                console.log("stockouts--", stockouts);
                console.log("stockins--", stockins);
                console.log("wastage--", wastages);
                console.log("stockcountsOpening--", stockcountsOpening);
                console.log("stockcountClosing--", stockcountsclose);
                console.log("grvtotal", grvTotal);
                //  console.log("new grv total",JSON.parse(JSON.stringify(grvitems)))
                console.log("idealstock", idealstock);
                for (let i = 0; i < stockdetail.length; i++) {
                    for (let j = 0; j < stockouts.length; j++) {
                        if (stockdetail[i].item_id == stockouts[j].item_id) {
                            stockdetail[i].totalStockOut = stockouts[j].totalstockout;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < wastage.length; k++) {
                        if (stockdetail[l].item_id == wastages[k].item_id) {
                            stockdetail[l].totalwastageqty = wastages[k].totalwastageqty;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < stockcountsOpening.length; k++) {
                        if (stockdetail[l].item_id == stockcountsOpening[k].item_id) {
                            stockdetail[l].openingstock =
                                stockcountsOpening[k].countedQty;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < stockcountsclose.length; k++) {
                        if (stockdetail[l].item_id == stockcountsclose[k].item_id) {
                            stockdetail[l].actualstock = stockcountsclose[k].countedQty;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < stockins.length; k++) {
                        if (stockdetail[l].item_id == stockins[k].item_id) {
                            stockdetail[l].stockin = stockins[k].totalstockin;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < grvTotal.length; k++) {
                        if (stockdetail[l].item_id == grvTotal[k].item_id) {
                            stockdetail[l].grv = parseFloat(grvTotal[k].totalgrvQty);
                        }
                    }
                }
                if (idealstock.length > 0) {
                    for (let l = 0; l < stockdetail.length; l++) {
                        for (let k = 0; k < idealstock.length; k++) {
                            if (stockdetail[l].item_id == idealstock[k].item_id) {
                                stockdetail[l].idealstock = idealstock[k].quantity;
                            }
                        }
                    }
                }
                return response_1.success(res, stockdetail);
            }
            catch (error) {
                console.log("eeeeee", error);
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: error.message
                });
            }
        });
    }
    foodcost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let brand_id = req.query.brand_id;
                let branch_id = req.query.branch_id;
                let fromdate = req.query.fromdate;
                let todate = req.query.todate;
                let limit = req.query.limit;
                let offset = req.query.offset;
                let totalcount = yield database_1.StockDetailTable.findAll({
                    where: { brand_id: brand_id, branch_id: branch_id }
                });
                let response = yield database_1.StockDetailTable.findAll({
                    where: { brand_id: brand_id, branch_id: branch_id },
                    attributes: [
                        "stock_detail_id",
                        "item_name_english",
                        "item_id",
                        "average_price",
                        "item_code"
                    ],
                    limit: limit,
                    offset: offset
                });
                let stockouts = yield database_1.sequelize.query(`select item_id, stock_detail_id,sum(quantity) as totalstockout from stockouts
		where brand_id=2 and branch_id=2
		group by item_id,stock_detail_id`);
                let wastage = yield database_1.sequelize.query(`select item_id,stock_detail_id, sum("wastageQty") as totalWastageQty
		from wastages  where branch_id=2 and brand_id=2
		group by item_id,stock_detail_id`);
                // 			let	wastage1 = await WastageTable.findAll({
                // 		where:{brand_id:2,branch_id:2},
                //     attributes: ['item_id', [sequelize.fn('sum', sequelize.col('wastageQty')), 'total_cost']],
                //     include: [
                //     {
                //         model: StockDetailTable,
                // 				attributes: ['item_name_english','item_id','stock_detail_id']
                //     }
                //     ],
                //     group: ['wastage.item_id','stockdetail.stock_detail_id']
                // })
                // console.log("wastage11111--",JSON.parse(JSON.stringify(wastage1)))
                let stockcountsOpening = yield database_1.sequelize.query(`select * from "stockcounts"
		where brand_id=2 and branch_id=2 and stockcountdate='2020-03-15 05:30:00+05:30' and status='new'`);
                let stockcountClosing = yield database_1.sequelize.query(`select item_id,stock_detail_id, sum("countedQty") as totalcount
		from stockcounts  where branch_id=2 and brand_id=2 
		and stockcountdate >='2020-03-13 05:30:00+05:30' AND stockcountdate <='2020-03-15 05:30:00+05:30'
		group by item_id,stock_detail_id`);
                let stockdetail = JSON.parse(JSON.stringify(response));
                console.log("stockdetail--", stockdetail);
                console.log("stockouts--", stockouts[0]);
                console.log("wastage--", wastage[0]);
                console.log("stockcountsOpening--", stockcountsOpening[0]);
                console.log("stockcountClosing--", stockcountClosing[0]);
                for (let i = 0; i < stockdetail.length; i++) {
                    for (let j = 0; j < stockouts[0].length; j++) {
                        if (stockdetail[i].item_id == stockouts[0][j].item_id) {
                            stockdetail[i].totalStockOut = stockouts[0][j].totalstockout;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < wastage[0].length; k++) {
                        if (stockdetail[l].item_id == wastage[0][k].item_id) {
                            stockdetail[l].totalwastageqty =
                                wastage[0][k].totalwastageqty;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < stockcountsOpening[0].length; k++) {
                        if (stockdetail[l].item_id == stockcountsOpening[0][k].item_id) {
                            stockdetail[l].openingstock =
                                stockcountsOpening[0][k].countedQty;
                        }
                    }
                }
                for (let l = 0; l < stockdetail.length; l++) {
                    for (let k = 0; k < stockcountClosing[0].length; k++) {
                        if (stockdetail[l].item_id == stockcountClosing[0][k].item_id) {
                            stockdetail[l].closingstock =
                                stockcountClosing[0][k].totalcount;
                        }
                    }
                }
                let obj = { total: totalcount, data: stockdetail };
                return response_1.success(res, obj);
            }
            catch (error) {
                console.log("eeeeee", error);
                next({
                    status: false,
                    message: "Some error occurred while configuration",
                    body: error.message
                });
            }
        });
    }
}
exports.foodcostController = foodcostController;
/**stock outs */
// select stockdetails.item_id as stockItem, 
// stockouts.item_id as stockoutsItem, sum(stockouts.quantity) as total
// from stockdetails
// join stockouts on stockdetails.item_id=stockouts.item_id
// where stockouts.brand_id=2 and stockouts.branch_id=2 and
// stockdetails.brand_id=2 and stockdetails.branch_id=2
// group by stockdetails.item_id,stockouts.item_id
// --select item_id, sum(quantity) as total from stockouts
// -- where brand_id=2 and branch_id=2
// -- group by item_id
//# sourceMappingURL=foodcost.js.map