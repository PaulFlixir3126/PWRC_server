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
exports.searchMenus = exports.menuDataPost = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ['menu_name', 'menu_name_arabic', 'brand_id', 'menu_status', 'menu_price'];
const menuDataPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'mandatory fileds are missing', data: arr };
        return res;
    }
    let getbrand = yield database_1.BrandTable.findAll({ where: { brand_id: req.body.brand_id } });
    if (getbrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound ', data: req.body.brand_id };
        return res;
    }
    let getmenuenglish = yield database_1.NewMenuTable.findAll({ where: { brand_id: req.body.brand_id, menu_name: req.body.menu_name } });
    let getmenuarbic = yield database_1.NewMenuTable.findAll({ where: { brand_id: req.body.brand_id, menu_name_arabic: req.body.menu_name_arabic } });
    if (getmenuenglish.length > 0 || getmenuarbic.length > 0) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'menu name already exists', data: [req.body.menu_name, req.body.menu_name_arabic] };
        return res;
    }
    logger_1.default.info("menuDataPost: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.menuDataPost = menuDataPost;
const searchMenus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsObjectAndNotEmpty(req.query)) {
        logger_1.default.error("searchMenus: query should not be empty");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'query should not be empty', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(req.query.searchBy)) {
        logger_1.default.error("searchMenus: searchBy should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'searchBy not found in query', data: [] };
        return res;
    }
    if (!genericValidator_1.checkIsSet(req.query.keyword)) {
        logger_1.default.error("searchMenus: keyword should not be undefined,null");
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'keyword not found in query', data: [] };
        return res;
    }
    let getbrand = yield database_1.BrandTable.findAll({ where: { brand_id: req.query.brand_id } });
    if (getbrand.length == 0) {
        let res = { status: false, code: 404, type: 'NotFound', message: 'brand id NotFound ', data: req.body.brand_id };
        return res;
    }
    logger_1.default.info("searchMenus: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.searchMenus = searchMenus;
//# sourceMappingURL=menuValidator.js.map