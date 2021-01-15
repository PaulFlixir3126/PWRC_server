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
exports.menuItemGroupController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
const menuItemGroupValidator_1 = require("../validators/menuItemGroupValidator");
class menuItemGroupController {
    menuItemGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** input validations */
                let validation = yield menuItemGroupValidator_1.menuItemGroupDataPost(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.MenuItemGroupTable.create(req.body);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while creating Menu Item Group',
                    body: err
                });
            }
        });
    }
    updateMenuItemGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { group_id } = req.body;
            try {
                /** input validations */
                let validation = yield menuItemGroupValidator_1.updateMenuItemGroupData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.MenuItemGroupTable.update(req.body, {
                    where: { group_id },
                    returning: true
                });
                response_1.success(res, response);
                /** change group name in master menu  */
                let menuMaster = yield database_1.NewMenuTable.findAll({
                    attributes: ['menu_data', 'menu_id'],
                    where: { brand_id: parseInt(req.body.brand.brand_id) }
                });
                let str1 = JSON.stringify(menuMaster);
                let pa1 = JSON.parse(str1);
                console.log("str1", str1);
                console.log("req.body", req.body);
                let filteredData = pa1.filter((ele) => {
                    if (ele.menu_data.length > 0) {
                        return ele;
                    }
                });
                if (filteredData.length > 0) {
                    for (let i = 0; i < filteredData.length; i++) {
                        for (let j = 0; j < filteredData[i].menu_data.length; j++) {
                            if (filteredData[i].menu_data[j].group_id === group_id) {
                                filteredData[i].menu_data[j].group_name = req.body.group_name;
                                filteredData[i].menu_data[j].group_name_arabic = req.body.group_name_arabic;
                                if (req.body.items != undefined || req.body.items != null) {
                                    req.body.items.forEach((ele) => {
                                        let duplicate = filteredData[i].menu_data[j].items.filter((obj) => {
                                            return obj.item_id == ele.item_id;
                                        });
                                        if (duplicate.length > 0) {
                                        }
                                        else {
                                            filteredData[i].menu_data[j].items.push(ele);
                                        }
                                    });
                                    // pa1[i].menu_data[j].items = req.body.items;
                                }
                            }
                        }
                        const response1 = yield database_1.NewMenuTable.update({ menu_data: filteredData[i].menu_data }, { where: { menu_id: filteredData[i].menu_id } });
                    }
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while updating Menu Item Group',
                    body: err
                });
            }
        });
    }
    returnMenuItemGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, brand_id } = req.query;
                let response;
                if (brand_id) {
                    response = yield database_1.MenuItemGroupTable.findAll({
                        where: { brand_id: brand_id },
                        include: [database_1.BrandTable]
                    });
                    response.sort((a, b) => +b.group_id - +a.group_id);
                    return response_1.success(res, response);
                }
                id
                    ? (response = yield database_1.MenuItemGroupTable.findAll({
                        where: { group_id: id }
                    }))
                    : (response = yield database_1.MenuItemGroupTable.findAll({
                        include: [database_1.BrandTable]
                    }));
                response.sort((a, b) => +b.group_id - +a.group_id);
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'some error occurred while retrieving Menu Item Group',
                    body: err
                });
            }
        });
    }
    deleteMenuItemGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, brand_id } = req.query;
            try {
                /** input validations */
                let validation = yield menuItemGroupValidator_1.deleteMenuItemGroupData(req);
                if (!validation.status) {
                    let obj = { status: false, type: validation.type, message: validation.message, data: validation.data };
                    return res.status(validation.code).send(obj);
                }
                const response = yield database_1.MenuItemGroupTable.destroy({
                    where: { group_id: id }
                });
                response_1.success(res, response);
                /** delete group from master menu  */
                let menuMaster = yield database_1.NewMenuTable.findAll({
                    attributes: ['menu_data', 'menu_id'],
                    where: { brand_id: parseInt(brand_id) }
                });
                let str1 = JSON.stringify(menuMaster);
                let pa = JSON.parse(str1);
                for (let i = 0; i < pa.length; i++) {
                    pa[i].menu_data = pa[i].menu_data.filter((obj) => {
                        return obj.group_id != id;
                    });
                    const response1 = yield database_1.NewMenuTable.update({ menu_data: pa[i].menu_data }, { where: { menu_id: pa[i].menu_id } });
                }
                /** delete group from master menu end */
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Internal server error',
                    body: err
                });
            }
        });
    }
}
exports.menuItemGroupController = menuItemGroupController;
//# sourceMappingURL=menuItemGroupController.js.map