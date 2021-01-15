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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItemGroupData = exports.updateMenuItemGroupData = exports.menuItemGroupDataPost = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ['group_name', 'group_name_arabic', 'brand_id'];
const menuItemGroupDataPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let getBrand = yield database_1.BrandTable.findAll({ where: { brand_id: req.body.brand_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound', data: req.body.brand_id };
        return res;
    }
    let getmigenglish = yield database_1.MenuItemGroupTable.findAll({ where: { brand_id: req.body.brand_id, group_name: req.body.group_name } });
    let getmigarbic = yield database_1.MenuItemGroupTable.findAll({ where: { brand_id: req.body.brand_id, group_name_arabic: req.body.group_name_arabic } });
    if (getmigenglish.length > 0 || getmigarbic.length > 0) {
        return { status: false, code: 400, type: 'invalidRequest', message: 'menu group name already exists', data: [req.body.group_name, req.body.group_name_arabic] };
    }
    logger_1.default.info("menuItemGroupDataPost: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.menuItemGroupDataPost = menuItemGroupDataPost;
const updateMenuItemGroupData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), ['group_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['group_id'] };
        return res;
    }
    let getBrand = yield database_1.MenuItemGroupTable.findAll({ where: { group_id: req.body.group_id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'group id NotFound', data: req.body.group_id };
        return res;
    }
    logger_1.default.info("updateMenuItemGroupData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.updateMenuItemGroupData = updateMenuItemGroupData;
const deleteMenuItemGroupData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.query), ['id', 'brand_id']);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: ['group_id', 'brand_id'] };
        return res;
    }
    let getBrand = yield database_1.MenuItemGroupTable.findAll({ where: { brand_id: req.query.brand_id, group_id: req.query.id } });
    if (getBrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'group id NotFound', data: req.query.id };
        return res;
    }
    logger_1.default.info("deleteMenuItemGroupData: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.deleteMenuItemGroupData = deleteMenuItemGroupData;
//# sourceMappingURL=menuItemGroupValidator.js.map