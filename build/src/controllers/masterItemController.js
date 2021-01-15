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
exports.masterItemController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class masterItemController {
    masterItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                const { item_name_english, brand_id, category_code } = req.body;
                response = yield database_1.MasterItemTable.findOne({
                    where: { item_name_english: item_name_english, brand_id: brand_id }
                });
                if (response) {
                    return next({ message: 'Already item  exist related to the brand' });
                }
                response = yield database_1.MasterItemTable.findAll({
                    where: { category_code: category_code, brand_id: brand_id },
                    raw: true
                });
                if (response.length == 0) {
                    req.body.item_code = category_code + '-' + '0001';
                }
                else {
                    response.sort((a, b) => +b.item_id - +a.item_id);
                    let code = response;
                    let codeValue = code[0].item_code.slice(-4);
                    let tempcodeValue = parseInt(codeValue) + 1;
                    let tempCode = tempcodeValue.toString();
                    if (tempCode.length == 1) {
                        req.body.item_code = category_code + '-' + '000' + tempCode;
                    }
                    if (tempCode.length == 2) {
                        req.body.item_code = category_code + '-' + '00' + tempCode;
                    }
                    if (tempCode.length == 3) {
                        req.body.item_code = category_code + '-' + '0' + tempCode;
                    }
                    if (tempCode.length >= 4) {
                        req.body.item_code = category_code + '-' + tempCode;
                    }
                }
                response = yield database_1.MasterItemTable.create(req.body, { returning: true });
                let getbranch = yield database_1.BranchTable.findAll({ where: { brand_id: brand_id } });
                let branch = JSON.parse(JSON.stringify(getbranch));
                for (let i = 0; i < branch.length; i++) {
                    req.body['branch_id'] = branch[i].branch_id;
                    req.body['item_id'] = response.item_id;
                    req.body['is_from_warehouse'] = false;
                    let createStockdata = yield database_1.StockDetailTable.create(req.body);
                }
                let getWarehouse = yield database_1.warehouse.findAll({ where: { brand_id: brand_id } });
                let warehouses = JSON.parse(JSON.stringify(getWarehouse));
                for (let i = 0; i < warehouses.length; i++) {
                    delete req.body.branch_id;
                    req.body['warehouse_id'] = warehouses[i].warehouse_id;
                    req.body['item_id'] = response.item_id;
                    req.body['is_from_warehouse'] = true;
                    let createStockdata = yield database_1.StockDetailTable.create(req.body);
                }
                return response_1.success(res, response);
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
    returnMasterItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let response;
                if (id) {
                    response = yield database_1.MasterItemTable.findAll({
                        where: { brand_id: id },
                        // limit:5,
                        include: [
                            {
                                model: database_1.BrandTable,
                                attributes: ['brand_name']
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
                    // let promiseAny = new Promise(resolve => {
                    // 	resolve(
                    // 		categoryResponse.map(r => {
                    // 			response.map(e => {
                    // 				if (e.category_code == r.category_code) {
                    // 					return (e.categoryname = r.category_name_english);
                    // 				}
                    // 			});
                    // 		})
                    // 	);
                    // });
                    // await promiseAny.then(r => {
                    // 	return success(res, response);
                    // });
                }
                response = yield database_1.MasterItemTable.findAll({
                    include: [
                        {
                            model: database_1.BrandTable,
                            attributes: ['brand_name', 'brand_id']
                        }
                    ]
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: err.message
                });
            }
        });
    }
    updateMasterItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.MasterItemTable.update(req.body, {
                    where: { item_id: req.body.item_id },
                    returning: true
                });
                updatestockdetail(response);
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
    removeMasterItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, item_id, item_number } = req.query;
                let grvData;
                grvData = yield database_1.GrvTable.findAll({
                    include: [
                        {
                            model: database_1.BranchTable,
                            attributes: ['branch_name'],
                            include: [{ model: database_1.BrandTable, attributes: ['brand_name', 'brand_id'] }]
                        }
                    ]
                });
                let data = JSON.parse(JSON.stringify(grvData));
                let filter = [];
                filter = yield new Promise(resolve => {
                    resolve(data
                        .filter((r) => {
                        return r.branch.brand.brand_id == id;
                    })
                        .map((r) => {
                        return r.stock_data[0];
                    })
                        .filter((r) => {
                        return r.item_number == item_number;
                    }));
                });
                if (filter.length >= 1) {
                    return next({ status: false, message: 'Item already included in GRV' });
                }
                const response = yield database_1.MasterItemTable.destroy({
                    where: { item_id: item_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({ status: false, message: 'Internal server error', body: err });
            }
        });
    }
    searchItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchBy = req.query.searchBy;
                let search = req.query.keyword;
                let brand_id = req.query.brand_id;
                let s = search + '%';
                let response;
                if (brand_id) {
                    if (searchBy == 'item_name') {
                        response = yield database_1.sequelize.query(`SELECT * FROM   masteritems
					WHERE brand_id=${brand_id}  and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == 'item_code') {
                        response = yield database_1.sequelize.query(`SELECT * FROM   masteritems
				 WHERE brand_id=${brand_id}  and lower(item_code) ILIKE '${s}' `);
                    }
                }
                return response_1.success(res, response[0]);
            }
            catch (error) {
                next({ status: false, message: 'Internal server error', body: error.message });
            }
        });
    }
    searchItemByType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let searchBy = req.query.searchBy;
                let search = req.query.keyword;
                let brand_id = req.query.brand_id;
                let s = search + '%';
                let response;
                let type = req.query.type;
                if (brand_id) {
                    if (searchBy == 'item_name') {
                        response = yield database_1.sequelize.query(`SELECT * FROM   masteritems
					 WHERE brand_id=${brand_id} and type='${type}'  and lower(item_name_english) ILIKE '${s}' `);
                    }
                    if (searchBy == 'item_code') {
                        response = yield database_1.sequelize.query(`SELECT * FROM   masteritems
					WHERE brand_id=${brand_id} and type='${type}' and lower(item_code)  ILIKE '${s}' `);
                    }
                }
                return response_1.success(res, response[0]);
            }
            catch (error) {
                next({ status: false, message: 'Internal server error', body: error.message });
            }
        });
    }
    // async returnStockDetailsItemData(req: Request, res: Response, next: NextFunction) {
    // 	try {
    // 		let { id } = req.query;
    // 		let response: any;
    // 		if (id) {
    // 			response = await StockDetailTable.findAll({
    // 				where: { brand_id: id,branch_id:req.query.branch_id },
    // 				// limit:5,
    // 				include: [
    // 					{
    // 						model: BrandTable,
    // 						attributes: ['brand_name']
    // 					}
    // 				]
    // 			});
    // 			response.sort((a: any, b: any) => +b.item_id - +a.item_id);
    // 			let categoryResponse: any = await MasterCategoryTable.findAll({
    // 				where: { brand_id: id }
    // 			});
    // 			let obj: any = {
    // 				itemResponse: response,
    // 				categoryResponse: categoryResponse
    // 			};
    // 			return success(res, obj);
    // 		}
    // 		response = await StockDetailTable.findAll({
    // 			include: [
    // 				{
    // 					model: BrandTable,
    // 					attributes: ['brand_name', 'brand_id']
    // 				}
    // 			]
    // 		});
    // 		return success(res, response);
    // 	} catch (err) {
    // 		console.log("eeeeeeee--",err)
    // 		next({
    // 			status: false,
    // 			message: 'Some error occurred while fetching  data',
    // 			body: err.message
    // 		});
    // 	}
    // }
    /*
        async updateQunatity(req: Request, res: Response, next: NextFunction) {
        try {
    
                let validation:any = await updatequantity(req.body);
                if (!validation.status) {
                    let obj = { status: false, message: validation.message, data: validation.data };
                    return invalidRequest(res, obj);
                }
                let body = req.body;
                let finaloutput=[];
                for(let i=0;i<body.length;i++){
                    let response: any = await MasterItemTable.find({
                        where: { item_code: body[i].item_code, item_id:body[i].item_id }});
                let itemRes=JSON.parse(JSON.stringify(response));
                let addQuantity=itemRes.quantity - parseFloat(body[i].transferQty)
                let check={
                    item_code:body[i].item_code,
                    availableqty:itemRes.quantity,
                    supplyqty:body[i].transferQty,
                    finalqty:addQuantity
                }
               if((addQuantity != null) || (addQuantity >= 0) || (addQuantity != NaN)){
                    const updateqty: any = await MasterItemTable.update({quantity:addQuantity}, {
                        where: { item_code: body[i].item_code },
                        returning: true
                    });
                    finaloutput.push(check)
                 }
                if(i == body.length-1) {
                    let finalres={message:'quantity updated successfully', data:finaloutput}
                    return success(res, finalres);
                }
            }
    
        } catch (error) {
                next({
            status: false,
            message: "Some error occurred while updating qunatity",
            body: error.message
          });
            }
      }
    */
    // async updateQunatity(req: Request, res: Response, next: NextFunction) {
    // 	try {
    // 		let validation:any = await updatequantity(req.body);
    // 		if (!validation.status) {
    // 			let obj = { status: false, message: validation.message, data: validation.data };
    // 			return invalidRequest(res, obj);
    // 		}
    // 		let body = req.body;
    // 		let finaloutput=[];
    // 		for(let i=0;i<body.length;i++){
    // 			let response: any = await StockDetailTable.find({
    // 				where: { item_code: body[i].item_code, item_id:body[i].item_id, brand_id:body[i].brand_id,branch_id:body[i].branch_id }});
    // 		let itemRes=JSON.parse(JSON.stringify(response));
    // 		let addQuantity=itemRes.quantity - parseFloat(body[i].transferQty)
    // 		let check={
    // 			item_code:body[i].item_code,
    // 			availableqty:itemRes.quantity,
    // 			supplyqty:body[i].transferQty,
    // 			finalqty:addQuantity
    // 		}
    // 		 if((addQuantity != null) || (addQuantity >= 0) || (addQuantity != NaN)){
    // 			const reduceQty: any = await StockDetailTable.update(
    // 				{ quantity: sequelize.literal(`quantity - ${parseFloat(body[i].transferQty)}`) }, 
    // 				{
    // 				where: { item_code: body[i].item_code, item_id:body[i].item_id, 
    // 					       brand_id:body[i].brand_id,branch_id:body[i].branch_id },
    // 				returning: true
    // 			});
    // 			const increaseQty: any = await StockDetailTable.update(
    // 				{ quantity: sequelize.literal(`quantity + ${parseFloat(body[i].transferQty)}`) }, 
    // 				{
    // 				where: { item_code: body[i].item_code, item_id:body[i].item_id, 
    // 					       brand_id:body[i].brand_id,branch_id:body[i].branch },
    // 				returning: true
    // 			});
    // 			finaloutput.push(check)
    // 		 }
    // 		if(i == body.length-1) { 
    // 			let finalres={message:'stockdetail quantity updated successfully', data:finaloutput}
    // 			return success(res, finalres);
    // 		}
    // 	}
    // 	} catch (error) {
    // 		next({
    // 			status: false,
    // 			message: "Some error occurred while updating qunatity",
    // 			body: error.message
    // 		});
    // 	}
    // }
    // async reduceQunatity(req: Request, res: Response, next: NextFunction) {
    // 	try {
    // 		let validation:any = await updatequantity(req.body);
    // 		if (!validation.status) {
    // 			let obj = { status: false, message: validation.message, data: validation.data };
    // 			return invalidRequest(res, obj);
    // 		}
    // 		let body = req.body;
    // 		let finaloutput=[];
    // 		for(let i=0;i<body.length;i++){
    // 			let response: any = await StockDetailTable.find({
    // 				where: { item_code: body[i].item_code, item_id:body[i].item_id, brand_id:body[i].brand_id,branch_id:body[i].branch_id }});
    // 		let itemRes=JSON.parse(JSON.stringify(response));
    // 		let addQuantity=itemRes.quantity - parseFloat(body[i].transferQty)
    // 		let check={
    // 			item_code:body[i].item_code,
    // 			availableqty:itemRes.quantity,
    // 			supplyqty:body[i].transferQty,
    // 			finalqty:addQuantity
    // 		}
    // 		 if((addQuantity != null) || (addQuantity >= 0) || (addQuantity != NaN)){
    // 			const reduceQty: any = await StockDetailTable.update(
    // 				{ quantity: sequelize.literal(`quantity - ${parseFloat(body[i].transferQty)}`) }, 
    // 				{
    // 				where: { item_code: body[i].item_code, item_id:body[i].item_id, 
    // 					       brand_id:body[i].brand_id,branch_id:body[i].branch_id },
    // 				returning: true
    // 			});
    // 			finaloutput.push(check)
    // 		 }
    // 		if(i == body.length-1) { 
    // 			let finalres={message:'stockdetail quantity updated successfully', data:finaloutput}
    // 			return success(res, finalres);
    // 		}
    // 	}
    // 	} catch (error) {
    // 		next({
    // 			status: false,
    // 			message: "Some error occurred while updating qunatity",
    // 			body: error.message
    // 		});
    // 	}
    // }
    /**api to add all grv item quantity into masterItem */
    script(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let createTable = yield database_1.sequelize.query(`ALTER TABLE masteritems
			ADD COLUMN quantity double precision NOT NULL DEFAULT 0 `);
            console.log("createTable", createTable);
            let grvTable = yield database_1.GrvTable.findAll({});
            grvTable.sort((a, b) => +b.stock_id - +a.stock_id);
            let grvtableres = JSON.parse(JSON.stringify(grvTable));
            console.log("grvtableres", grvtableres);
            let itemwithquantity = [];
            for (let i = 0; i < grvtableres.length; i++) {
                for (let j = 0; j < grvtableres[i].stock_data.length; j++) {
                    let obj = {
                        stock_id: grvtableres[i].stock_id,
                        item_code: grvtableres[i].stock_data[j].item_number,
                        item_name: grvtableres[i].stock_data[j].item_name,
                        quntity: grvtableres[i].stock_data[j].quantity
                    };
                    itemwithquantity.push(obj);
                }
            }
            console.log("sssss", itemwithquantity);
            var map = itemwithquantity.reduce(function (map, e) {
                map[e.item_code] = +e.quntity + (map[e.item_code] || 0);
                return map;
            }, {});
            var result = Object.keys(map).map(function (k) {
                return { item_code: k, quntity: map[k].toFixed(3) };
            });
            console.log("--", result);
            for (let i = 0; i < result.length; i++) {
                const response = yield database_1.MasterItemTable.update({ quantity: result[i].quntity }, {
                    where: { item_code: result[i].item_code },
                    returning: true
                });
                console.log("res update", response);
                if (i == result.length - 1) {
                    console.log("finish");
                    res.send({ message: 'quantity column created, quantity updated in masteritem table from grv table' });
                    //Do something if the end of the loop    
                }
            }
        });
    }
}
exports.masterItemController = masterItemController;
function updatestockdetail(res) {
    return __awaiter(this, void 0, void 0, function* () {
        let masterItemUpdateRes = JSON.parse(JSON.stringify(res));
        if (masterItemUpdateRes[0] == 1) {
            let update = {
                item_name_english: masterItemUpdateRes[1][0].item_name_english,
                item_name_arabic: masterItemUpdateRes[1][0].item_name_arabic,
                last_price: masterItemUpdateRes[1][0].last_price,
                average_price: masterItemUpdateRes[1][0].average_price,
                item_code: masterItemUpdateRes[1][0].item_code,
                measuring_unit: masterItemUpdateRes[1][0].measuring_unit,
                category_code: masterItemUpdateRes[1][0].category_code,
                type: masterItemUpdateRes[1][0].type,
            };
            const response = yield database_1.StockDetailTable.update(update, {
                where: { item_id: masterItemUpdateRes[1][0].item_id, brand_id: masterItemUpdateRes[1][0].brand_id },
                returning: true
            });
            console.log("stockdetail update", JSON.parse(JSON.stringify(response)));
        }
    });
}
//# sourceMappingURL=masterItemController.js.map