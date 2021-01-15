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
exports.newMenuController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const queryBuilder_1 = require("../lib/queryBuilder");
const global_crud_1 = require("../lib/global-crud");
const menuValidator_1 = require("../validators/menuValidator");
class newMenuController {
    menuData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield menuValidator_1.menuDataPost(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                // let { allBranches, menuCategory, menu_price, menu_name, menu_data } = req.body;
                // let { menuCategory } = req.body;
                // const functionWithPromise = async (item: any) => {
                // 	let u: any = await BranchTable.findAll({ raw: true, where: { branch_id: item.branch_id } });
                // 	let found = u[0].category_ids.find((el: any) => el === menuCategory);
                // 	if (!found) {
                // 		await sequelize.query(
                // 			`UPDATE branches SET category_ids = array_append(category_ids,'${menuCategory}') WHERE branch_id = '${
                // 				u[0].branch_id
                // 			}' `
                // 		);
                // 	}
                // 	return Promise.resolve(u);
                // };
                // const anAsyncFunction = async (item: any) => {
                // 	return await functionWithPromise(item);
                // };
                // const saveCategoryIdToBranch = async () => {
                // 	return await Promise.all(allBranches.map((item: any) => anAsyncFunction(item)));
                // };
                // await saveCategoryIdToBranch();
                // allBranches.map((r: any) => {
                // 	delete r.createdAt;
                // 	delete r.updatedAt;
                // 	delete r.group_id;
                // 	delete r.restaurant_type;
                // 	delete r.branch_status;
                // 	delete r.branch_location;
                // });
                // let allMenu = allBranches;
                // allMenu.map((r: any) => {
                // 	r.category_id = menuCategory;
                // 	r.menu_price = menu_price;
                // 	r.menu_name = menu_name;
                // 	r.menu_data = menu_data;
                // });
                // let menu = await NewMenuTable.bulkCreate(allMenu, { returning: true });
                // req.body.category_id = menuCategory;
                let menu = yield database_1.NewMenuTable.create(req.body);
                // let response: any = JSON.parse(JSON.stringify(menu));
                // if (req.body.menu_data) {
                // 	let groupArray = req.body.menu_data.map((r: any) => {
                // 		return {
                // 			menu_id: response.menu_id,
                // 			group_id: r.group_id,
                // 			min_qty: r.min_qty,
                // 			max_qty: r.max_qty
                // 		};
                // 	});
                // await MenuMasterTable.bulkCreate(groupArray, {
                // 	returning: true
                // });
                // let itemStatusArray: any = [];
                // req.body.menu_data.map((e: any) => {
                // 	itemStatusArray = e.items.map((r: any) => {
                // 		return {
                // 			item_group_id: r.ItemGroupTable.item_group_id,
                // 			group_id: e.group_id,
                // 			item_id: r.item_id,
                // 			item_status: r.item_status,
                // 			default_status: r.default_status
                // 		};
                // 	});
                // });
                // return success(res, itemStatusArray);
                // itemStatusArray.forEach(async (r: any) => {
                // 	await ItemGroupTable.update(r, {
                // 		where: { item_group_id: r.item_group_id }
                // 	});
                // });
                // await ItemGroupTable.bulkCreate(itemStatusArray, {
                // 	fields: ['item_group_id', 'group_id', 'item_id', 'item_status', 'default_status']
                // 	// updateOnDuplicate: ['item_group_id']
                // });
                // }
                response_1.success(res, menu);
            }
            catch (err) {
                next({ body: err });
            }
        });
    }
    returnMenuData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response, query = {}, find = {}, { id, verbose = false } = req.query;
                if (verbose) {
                    query = yield queryBuilder_1.queryBuilder(req.query);
                    find = {
                        where: database_1.Sequelize.and(query),
                        include: [{ model: database_1.CategoryCatalogTable }, { model: database_1.PrintConfigTable }],
                        limit: req.query.limit,
                        offset: req.query.offset
                    };
                    response = yield database_1.NewMenuTable.findAll(find);
                    response.sort((a, b) => +a.menu_order - +b.menu_order);
                    // response = await NewMenuTable.findAll({
                    // 	include: [
                    // 		{
                    // 			model: newMenuMasterTable
                    // 		}
                    // 	]
                    // });
                    // response = await sequelize.query(
                    // 	`select * from newmenus inner join "categoryCatalogs" on newmenus.category_id="categoryCatalogs".category_id right join newmenumaster on newmenus.menu_id=newmenumaster.menu_id inner join menuitemgroups on menuitemgroups.group_id=newmenumaster.group_id inner join  items on newmenumaster.item_id=items.item_id`
                    // );
                    // response = await sequelize.query(`select * from newmenus inner join menumasters on newmenus.menu_id=menumasters.menu_id
                    // inner join itemgroups on menumasters.group_id=itemgroups.group_id inner join items on itemgroups.item_id=items.item_id;select * from newmenus inner join menumasters on newmenus.menu_id=menumasters.menu_id
                    // inner join itemgroups on menumasters.group_id=itemgroups.group_id inner join items on itemgroups.item_id=items.item_id group by menu_id`);
                    // response = await NewMenuTable.findAll({
                    // 	include: [
                    // 		{ model: CategoryCatalogTable },
                    // 		{ model: PrintConfigTable },
                    // 		{
                    // 			model: MenuItemGroupTable,
                    // 			through: {
                    // 				model: newMenuMasterTable,
                    // 				attributes: ['new_menu_id', 'min_qty', 'max_qty']
                    // 			},
                    // 			include: [
                    // 				{
                    // 					model: ItemTable,
                    // 					through: {
                    // 						model: ItemGroupTable,
                    // 						attributes: ['item_group_id']
                    // 					}
                    // 				}
                    // 			]
                    // 		}
                    // 	]
                    // });
                    return response_1.success(res, response);
                }
                if (id) {
                    find = {
                        where: { menu_id: id },
                        include: [{ model: database_1.CategoryCatalogTable }, { model: database_1.PrintConfigTable }]
                    };
                    response = yield database_1.NewMenuTable.findAll(find);
                    response.sort((a, b) => +a.menu_order - +b.menu_order);
                    return response_1.success(res, response);
                }
                response = yield database_1.NewMenuTable.findAll({
                    include: [{ model: database_1.CategoryCatalogTable }, { model: database_1.PrintConfigTable }],
                });
                response.sort((a, b) => +a.menu_order - +b.menu_order);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    message: 'Error occurred while retrieving menu data',
                    body: err
                });
            }
        });
    }
    deleteMenuData(req, res, next) {
        global_crud_1.gDelete(req.query, `menu_id`, database_1.NewMenuTable, res, next);
    }
    updateMenuData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let a = yield global_crud_1.gUpdate(req.body, `menu_id`, database_1.NewMenuTable, res, next);
            //  let menu =await NewMenuTable.find({where:{menu_id:req.body.menu_id}})
            //  let menu1= JSON.parse(JSON.stringify(menu))
            //  if(menu1.menu_name == req.body.menu_name || menu1.menu_name_arabic == req.body.menu_name_arabic){
            // 	 let getorders= await OrderTable.findAll({where:{brand_id:req.body.brand_id}})
            // 	 let getorders1= JSON.parse(JSON.stringify(getorders))
            // 	 for(let i=0;i<getorders1.length;i++){
            // 		 for(let j=0;j<getorders1[i].order_details.length;j++){
            //         if(getorders1[i].order_details[j].menu_id == req.body.menu_id){
            // 					getorders1[i].order_details[j].menu_name = req.body.menu_name
            // 					getorders1[i].order_details[j]. menu_name_arabic = req.body. menu_name_arabic
            // 					let orderupdate=await OrderTable.update({order_details:getorders1[i].order_details}, {
            // 						where:{order_id:getorders1[i].order_id}
            // 					})
            // 				}
            // 			}
            // 	 }
            // 	}
        });
    }
    searchMenus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield menuValidator_1.searchMenus(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                let searchBy = req.query.searchBy;
                let search = req.query.keyword;
                let brand_id = req.query.brand_id;
                let s = '%' + search + '%';
                let response;
                if (brand_id) {
                    if (searchBy == 'menu_name_arabic') {
                        response = yield database_1.sequelize.query(`SELECT * FROM   newmenus
						WHERE brand_id=${brand_id} and lower(menu_name_arabic) ILIKE '${s}' `);
                    }
                    if (searchBy == 'menu_name_english') {
                        response = yield database_1.sequelize.query(`SELECT * FROM   newmenus
						WHERE brand_id=${brand_id} and lower(menu_name) ILIKE '${s}' `);
                    }
                    return response_1.success(res, response[0]);
                }
                if (searchBy == 'menu_name_arabic') {
                    response = yield database_1.sequelize.query(`SELECT * FROM   newmenus
					WHERE  lower(menu_name_arabic) ILIKE '${s}' `);
                }
                if (searchBy == 'menu_name_english') {
                    response = yield database_1.sequelize.query(`SELECT * FROM   newmenus
					WHERE lower(menu_name) ILIKE '${s}' `);
                }
                return response_1.success(res, response[0]);
            }
            catch (error) {
                next({ status: false, message: 'Internal server error', body: error.message });
            }
        });
    }
}
exports.newMenuController = newMenuController;
//# sourceMappingURL=newMenuController.js.map