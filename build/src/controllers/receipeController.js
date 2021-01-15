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
exports.receipeController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const recipeValidator_1 = require("../validators/recipeValidator");
class receipeController {
    saveReceipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let recipeValidation = yield recipeValidator_1.menurecipeSaveUpdate(req.body);
                if (!recipeValidation.status) {
                    let obj = { status: false, type: recipeValidation.type, message: recipeValidation.message, data: recipeValidation.data };
                    return res.status(recipeValidation.code).send(obj);
                }
                let response;
                let body = req.body.data;
                /*save the menurecipe */
                response = yield database_1.MenuRecipe.bulkCreate(body, { returning: true });
                /*save the mainmenurecipe */
                yield database_1.MenuMasterrecipeTable.create({
                    menu_id: body[0].menu_id,
                    brand_id: body[0].brand_id,
                    menu_name: body[0].menu_name
                });
                /**auto update if menu recipe item have separate Semi finied item recipe */
                yield database_1.sequelize.query(`UPDATE menurecipes SET item_recipe_id = itemmasterrecipes.item_recipe_id
					  FROM "itemmasterrecipes"
						 WHERE itemmasterrecipes.item_id = menurecipes.item_id`);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Some error occurred while saving menu recipe",
                    body: err.message
                });
            }
        });
    }
    GetReceipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let query = req.query;
                response = yield database_1.MenuMasterrecipeTable.findAll({
                    where: {
                        menu_id: query.menu_id,
                        brand_id: query.brand_id
                    },
                    include: [
                        {
                            model: database_1.NewMenuTable,
                            attributes: ["menu_id", "menu_name", "menu_name_arabic"]
                        },
                        {
                            model: database_1.MenuRecipe,
                            include: [
                                { model: database_1.MasterItemTable },
                                { model: database_1.ItemMasterrecipeTable },
                                {
                                    model: database_1.BrandTable,
                                    attributes: ["brand_id", "brand_name", "brand_name_arabic"]
                                }
                            ]
                        }
                    ]
                });
                return response_1.success(res, response);
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
    upadteReceipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let recipeValidation = yield recipeValidator_1.menurecipeSaveUpdate(req.body);
                if (!recipeValidation.status) {
                    let obj = { status: false, type: recipeValidation.type, message: recipeValidation.message, data: recipeValidation.data };
                    return res.status(recipeValidation.code).send(obj);
                }
                let response;
                let body = req.body.data;
                let update = [];
                let newdata = [];
                for (let i = 0; i < body.length; i++) {
                    let check = yield database_1.MenuRecipe.findAll({
                        where: { menu_id: body[i].menu_id, item_id: body[i].item_id }
                    });
                    let check1 = JSON.parse(JSON.stringify(check));
                    if (check1.length > 0) {
                        response = yield database_1.MenuRecipe.update({
                            quantity: body[i].quantity,
                            package_Type: body[i].package_Type
                        }, {
                            where: {
                                item_id: body[i].item_id,
                                menu_id: body[i].menu_id
                            },
                            returning: true
                        });
                        update.push(JSON.parse(JSON.stringify(response)));
                    }
                    else {
                        const createnew = yield database_1.MenuRecipe.create(body[i]);
                        newdata.push(JSON.parse(JSON.stringify(createnew)));
                    }
                    if (i == body.length - 1) {
                        let obj = { newdata: newdata, update: update };
                        return response_1.success(res, obj);
                    }
                }
                return response_1.success(res, response);
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
    removeRecipes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                if (query.delete == "item") {
                    const removeMainRecipes = yield database_1.MenuRecipe.destroy({
                        where: {
                            menu_id: query.menu_id,
                            item_id: query.item_id,
                            brand_id: query.brand_id
                        }
                    });
                    const checmenuRecipe = yield database_1.MenuRecipe.findAll({
                        where: { menu_id: query.menu_id, brand_id: query.brand_id }
                    });
                    let checmenuRecipe1 = JSON.parse(JSON.stringify(checmenuRecipe));
                    if (checmenuRecipe1.length == 0) {
                        const removeMainRecipes = yield database_1.MenuRecipe.destroy({
                            where: { menu_id: query.menu_id, brand_id: query.brand_id }
                        });
                        const removemenumasterRecipes = yield database_1.MenuMasterrecipeTable.destroy({
                            where: { menu_id: query.menu_id, brand_id: query.brand_id }
                        });
                    }
                    return response_1.success(res, removeMainRecipes);
                }
                if (req.query.delete == "recipes") {
                    const removeMainRecipes = yield database_1.MenuMasterrecipeTable.destroy({
                        where: { menu_id: req.body.menu_id }
                    });
                    const removeRecipes = yield database_1.MenuRecipe.destroy({
                        where: { menu_id: req.body.menu_id }
                    });
                    return response_1.success(res, {});
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: "Internal server error",
                    body: err.message
                });
            }
        });
    }
    saveItemReceipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let recipeValidation = yield recipeValidator_1.semifiniedrecipeSaveUpdate(req.body);
                if (!recipeValidation.status) {
                    let obj = { status: false, type: recipeValidation.type, message: recipeValidation.message, data: recipeValidation.data };
                    return res.status(recipeValidation.code).send(obj);
                }
                let response;
                let body = req.body.data;
                response = yield database_1.ItemRecipe.bulkCreate(body, { returning: true });
                const savemainreceipe = yield database_1.ItemMasterrecipeTable.create({
                    item_id: body[0].item_id,
                    brand_id: body[0].brand_id,
                    item_name: body[0].item_name
                });
                return response_1.success(res, response);
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
    GetItemReceipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let response = yield database_1.ItemMasterrecipeTable.findAll({
                    where: {
                        item_id: query.item_id,
                        brand_id: query.brand_id
                    },
                    include: [{ model: database_1.ItemRecipe }]
                });
                let itemres = JSON.parse(JSON.stringify(response));
                if (itemres.length > 0) {
                    for (let i = 0; i < itemres.length; i++) {
                        for (let j = 0; j < itemres[i].itemrecipes.length; j++) {
                            let getmasterItems = yield database_1.MasterItemTable.findOne({
                                where: {
                                    item_id: itemres[i].itemrecipes[j].masterItem_id,
                                    brand_id: query.brand_id
                                }
                            });
                            let masteritemRes = JSON.parse(JSON.stringify(getmasterItems));
                            itemres[i].itemrecipes[j]["masteritem"] = masteritemRes;
                        }
                    }
                    return response_1.success(res, itemres);
                }
                return response_1.success(res, itemres);
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
    upadteItemReceipe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let recipeValidation = yield recipeValidator_1.semifiniedrecipeSaveUpdate(req.body);
                if (!recipeValidation.status) {
                    let obj = { status: false, type: recipeValidation.type, message: recipeValidation.message, data: recipeValidation.data };
                    return res.status(recipeValidation.code).send(obj);
                }
                let response;
                let body = req.body.data;
                let update = [];
                let newdata = [];
                for (let i = 0; i < body.length; i++) {
                    let check = yield database_1.ItemRecipe.findAll({
                        where: {
                            item_id: body[i].item_id,
                            masterItem_id: body[i].masterItem_id
                        }
                    });
                    let check1 = JSON.parse(JSON.stringify(check));
                    if (check1.length > 0) {
                        response = yield database_1.ItemRecipe.update({
                            quantity: body[i].quantity,
                            package_Type: body[i].package_Type
                        }, {
                            where: {
                                item_id: body[i].item_id,
                                masterItem_id: body[i].masterItem_id
                            },
                            returning: true
                        });
                        update.push(JSON.parse(JSON.stringify(response)));
                    }
                    else {
                        const createnew = yield database_1.ItemRecipe.create(body[i]);
                        newdata.push(JSON.parse(JSON.stringify(createnew)));
                    }
                    if (i == body.length - 1) {
                        let obj = { newdata: newdata, update: update };
                        return response_1.success(res, obj);
                    }
                }
                return response_1.success(res, response);
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
    removeItemRecipes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                if (query.delete == "itemrecipes") {
                    const removeItemRecipes = yield database_1.ItemRecipe.destroy({
                        where: {
                            item_id: parseInt(query.item_id),
                            masterItem_id: parseInt(query.masterItem_id),
                            brand_id: parseInt(query.brand_id)
                        }
                    });
                    const checitemRecipe = yield database_1.ItemRecipe.findAll({
                        where: {
                            item_id: parseInt(query.item_id),
                            brand_id: parseInt(query.brand_id)
                        }
                    });
                    let checitemRecipe1 = JSON.parse(JSON.stringify(checitemRecipe));
                    if (checitemRecipe1.length == 0) {
                        const removeMainRecipes = yield database_1.ItemMasterrecipeTable.destroy({
                            where: { item_id: query.item_id, brand_id: parseInt(query.brand_id) }
                        });
                        const removeRecipes = yield database_1.ItemRecipe.destroy({
                            where: { item_id: query.item_id, brand_id: parseInt(query.brand_id) }
                        });
                    }
                    return response_1.success(res, removeItemRecipes);
                }
                if (req.query.delete == "mainItemrecipes") {
                    const removeMainRecipes = yield database_1.ItemMasterrecipeTable.destroy({
                        where: { item_id: req.body.item_id }
                    });
                    const removeRecipes = yield database_1.ItemRecipe.destroy({
                        where: { item_id: req.body.item_id }
                    });
                    return response_1.success(res, {});
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: "Internal server error",
                    body: err.message
                });
            }
        });
    }
    grvUnitprice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let item_id = req.query.item_id;
                let brand_id = req.query.brand_id;
                let branch_id = req.query.branch_id;
                let grvitems;
                if (item_id == undefined && brand_id != undefined && branch_id == undefined) {
                    grvitems = yield database_1.grvItems.findAll({
                        where: { brand_id: brand_id },
                        attributes: ["item_id", [database_1.sequelize.fn("AVG", database_1.sequelize.col("unitprice")), "totalunit_price"]],
                        group: ["item_id"]
                    });
                    return response_1.success(res, grvitems);
                }
                if (item_id != undefined && brand_id != undefined && branch_id != undefined) {
                    grvitems = yield database_1.grvItems.findAll({
                        where: { brand_id: brand_id, branch_id: branch_id },
                        attributes: ["item_id", [database_1.sequelize.fn("AVG", database_1.sequelize.col("unitprice")), "totalunit_price"]],
                        group: ["item_id"]
                    });
                    return response_1.success(res, grvitems);
                }
                if (item_id != undefined && brand_id != undefined && branch_id == undefined) {
                    grvitems = yield database_1.grvItems.findAll({
                        where: { brand_id: brand_id, item_id: item_id },
                        attributes: ["item_id", [database_1.sequelize.fn("AVG", database_1.sequelize.col("unitprice")), "totalunit_price"]],
                        group: ["item_id"]
                    });
                    return response_1.success(res, grvitems);
                }
                if (item_id != undefined && brand_id != undefined && branch_id != undefined) {
                    grvitems = yield database_1.grvItems.findAll({
                        where: { brand_id: brand_id, item_id: item_id, branch_id: branch_id },
                        attributes: ["item_id", [database_1.sequelize.fn("AVG", database_1.sequelize.col("unitprice")), "totalunit_price"]],
                        group: ["item_id"]
                    });
                    return response_1.success(res, grvitems);
                }
                if (item_id == undefined && brand_id != undefined && branch_id != undefined) {
                    grvitems = yield database_1.grvItems.findAll({
                        where: { brand_id: brand_id, branch_id: branch_id },
                        attributes: ["item_id", [database_1.sequelize.fn("AVG", database_1.sequelize.col("unitprice")), "totalunit_price"]],
                        group: ["item_id"]
                    });
                    return response_1.success(res, grvitems);
                }
                grvitems = yield database_1.grvItems.findAll({
                    attributes: ["item_id", [database_1.sequelize.fn("AVG", database_1.sequelize.col("unitprice")), "totalunit_price"]],
                    group: ["item_id"]
                });
                return response_1.success(res, grvitems);
            }
            catch (err) {
                next({
                    status: false,
                    message: "Internal server error while getting grvUnitprice",
                    body: err.message
                });
            }
        });
    }
}
exports.receipeController = receipeController;
// UPDATE menurecipes
// SET item_recipe_id = itemmasterrecipes.item_recipe_id
// FROM itemmasterrecipes
// WHERE itemmasterrecipes.item_id = menurecipes.id
//  UPDATE menurecipes
//   SET item_recipe_id = itemmasterrecipes.item_recipe_id
//  FROM "itemmasterrecipes"
//   WHERE itemmasterrecipes.item_id = menurecipes.item_id
// UPDATE menurecipes
// SET item_recipe_id = itemmasterrecipes.item_recipe_id
// FROM "itemmasterrecipes" where itemmasterrecipes.item_id = menurecipes.item_id
// SELECT * FROM "masteritems"  WHERE item_id IN
//    (SELECT item_id  FROM "stockCounts"  WHERE stockcountdate = '2020-03-06 05:30:00+05:30' )
// response = await sequelize.query(`
// select item_id, sum("wastageQty") as totalWastageQty
// from wastages
// where "createdAt" between '2020-02-01 00:00:00' and '2020-02-28 23:59:59'
// group by item_id`);
// console.log("response",response)
// async upadteReceipe(req: Request, res: Response, next: NextFunction) {
// 	try {
// 		let response;
// 		let body = req.body.data
// 		let update=[]
// 		for(let i=0;i<body.length;i++){
// 			response = await MenuRecipe.update({quantity:body[i].quantity,package_Type:body[i].package_Type}, {
// 				where: { item_id: body[i].item_id,menu_id:body[i].menu_id },
// 				returning: true
// 			});
// 			console.log("====",JSON.parse(JSON.stringify(response)))
// 			update.push(JSON.parse(JSON.stringify(response)))
// 			if(i == body.length-1) {
// 				console.log("finish");
// 				 return success(res, update);
// 			}
// 		}
// 		return success(res, response);
// 	} catch (err) {
// 		next({
// 			status: false,
// 			message: 'Some error occurred while configuration',
// 			body: err.message
// 		}
// 	}
// }
//# sourceMappingURL=receipeController.js.map