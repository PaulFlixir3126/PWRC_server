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
exports.itemController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const queryBuilder_1 = require("../lib/queryBuilder");
const itemValidator_1 = require("../validators/itemValidator");
class itemController {
    itemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield itemValidator_1.itemDataPOST(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const { brand_id, item_name } = req.body;
                let response = yield database_1.ItemTable.findOne({
                    where: database_1.Sequelize.and({ brand_id, item_name })
                });
                if (!response) {
                    response = yield database_1.ItemTable.create(req.body);
                    return response_1.success(res, response);
                }
                next({ message: 'Duplicate Item' });
            }
            catch (err) {
                next({
                    message: 'Some error occurred while creating items',
                    body: err,
                    type: 'internal_server'
                });
            }
        });
    }
    updateItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { item_id } = req.body;
            try {
                /** input validations */
                let validation = yield itemValidator_1.updateItemData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.ItemTable.update(req.body, {
                    where: { item_id },
                    returning: true
                });
                response_1.success(res, response);
                /** change item name in menuitemgroup  */
                let test = yield database_1.MenuItemGroupTable.findAll({
                    attributes: ['items', "group_id"],
                    where: { brand_id: req.body.brand_id }
                });
                let str = JSON.stringify(test);
                let pa = JSON.parse(str);
                pa.forEach((entry) => __awaiter(this, void 0, void 0, function* () {
                    let a = [{ group_id: '', item: [] }];
                    entry.items.forEach(function (entry2) {
                        if (entry2.item_id == item_id) {
                            entry2.item_name = req.body.item_name;
                            entry2.item_name_arabic = req.body.item_name_arabic;
                            a[0]['group_id'] = entry.group_id;
                            a[0]['item'].push(entry2);
                        }
                        else {
                            a[0]['group_id'] = entry.group_id;
                            a[0]['item'].push(entry2);
                        }
                    });
                    let x = { items: a[0]['item'], group_id: a[0]['group_id'] };
                    console.log("x.group_id", x.group_id);
                    const response1 = yield database_1.MenuItemGroupTable.update({ items: x.items }, {
                        where: { group_id: x.group_id },
                    });
                    a = [{ group_id: '', item: [] }];
                }));
                /** changed item name in menuitemgroup  */
                /** change item name in master menu  */
                let menuMaster = yield database_1.NewMenuTable.findAll({
                    attributes: ['menu_data', "menu_id"],
                    where: { brand_id: req.body.brand_id }
                });
                let str1 = JSON.stringify(menuMaster);
                let pa1 = JSON.parse(str1);
                for (let i = 0; i < pa1.length; i++) {
                    if (pa1[i].menu_data.length > 0) {
                        for (let j = 0; j < pa1[i].menu_data.length; j++) {
                            if (pa1[i].menu_data[j].items != undefined || pa1[i].menu_data[j].items != null) {
                                for (let k = 0; k < pa1[i].menu_data[j].items.length; k++) {
                                    if (pa1[i].menu_data[j].items[k].item_id === item_id) {
                                        pa1[i].menu_data[j].items[k].item_name = req.body.item_name;
                                        pa1[i].menu_data[j].items[k].item_name_arabic = req.body.item_name_arabic;
                                    }
                                }
                            }
                        }
                    }
                    console.log("x", pa1[i]);
                    const response1 = yield database_1.NewMenuTable.update({ menu_data: pa1[i].menu_data }, {
                        where: { menu_id: pa1[i].menu_id },
                    });
                }
                /** changed item name in master menu  */
            }
            catch (err) {
                console.log("eee", err);
                next({
                    message: 'Some error occurred while updating items',
                    body: err,
                    type: 'internal_server'
                });
            }
        });
    }
    returnItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { verbose } = req.query;
                const key = `item_id`;
                const query = queryBuilder_1.queryBuilder(req.query, key);
                let response;
                if (verbose) {
                    response = yield database_1.ItemTable.findAll({
                        where: database_1.Sequelize.and(query)
                    });
                    return response_1.success(res, response.reverse());
                }
                query[key]
                    ? (response = yield database_1.ItemTable.findAll({
                        where: database_1.Sequelize.and(query)
                    }))
                    : (response = yield database_1.ItemTable.findAll({}));
                return response_1.success(res, response.reverse());
            }
            catch (err) {
                next({
                    message: 'Some error occurred while retrieving items',
                    body: err,
                    type: 'internal_server'
                });
            }
        });
    }
    deleteItemData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, brand_id } = req.query;
            try {
                /** input validations */
                let validation = yield itemValidator_1.deleteItemData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.ItemTable.destroy({
                    where: { item_id: id }
                });
                response_1.success(res, response);
                /** delete item name in menuitemgroup  */
                let test = yield database_1.MenuItemGroupTable.findAll({
                    attributes: ['items', "group_id"],
                    where: { brand_id: parseInt(brand_id) }
                });
                let str = JSON.stringify(test);
                let pa = JSON.parse(str);
                for (let i = 0; i < pa.length; i++) {
                    pa[i].items = pa[i].items.filter((obj) => {
                        return obj.item_id != id;
                    });
                    const response1 = yield database_1.MenuItemGroupTable.update({ items: pa[i].items }, {
                        where: { group_id: pa[i].group_id },
                    });
                }
                /** delete item name in master menu  */
                let menuMaster = yield database_1.NewMenuTable.findAll({
                    attributes: ['menu_data', "menu_id"],
                    where: { brand_id: parseInt(brand_id) }
                });
                let str2 = JSON.stringify(menuMaster);
                let par = JSON.parse(str2);
                for (let i = 0; i < par.length; i++) {
                    for (let j = 0; j < par[i].menu_data.length; j++) {
                        if (par[i].menu_data[j].items != undefined || par[i].menu_data[j].items != null) {
                            for (let k = 0; k < par[i].menu_data[j].items.length; k++) {
                                if (parseInt(par[i].menu_data[j].items[k].item_id) === parseInt(id)) {
                                    par[i].menu_data[j].items.splice(k, 1);
                                }
                            }
                        }
                    }
                    const response1 = yield database_1.NewMenuTable.update({ menu_data: par[i].menu_data }, {
                        where: { menu_id: par[i].menu_id },
                    });
                }
            }
            catch (err) {
                next({
                    message: 'Internal server error',
                    body: err,
                    type: 'internal_server'
                });
            }
        });
    }
}
exports.itemController = itemController;
//# sourceMappingURL=itemController.js.map