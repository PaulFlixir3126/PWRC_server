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
exports.semifiniedrecipeSaveUpdate = exports.menurecipeSaveUpdate = void 0;
const logger_1 = __importDefault(require("../lib/logger"));
const menurecipeSaveUpdate = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let Menu_id_unique = yield checkuniqueMenu_id(body.data);
    if (!Menu_id_unique.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: Menu_id_unique.message, data: Menu_id_unique.data };
        return res;
    }
    let duplicate_itemids = yield duplicateItemId(body.data);
    if (!duplicate_itemids.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: duplicate_itemids.message, data: duplicate_itemids.data };
        return res;
    }
    let Brand_id_unique = yield checkuniqueBrand_id(body.data);
    if (!Brand_id_unique.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: Brand_id_unique.message, data: Brand_id_unique.data };
        return res;
    }
    logger_1.default.info("menurecipesave: all validations passed");
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.menurecipeSaveUpdate = menurecipeSaveUpdate;
const semifiniedrecipeSaveUpdate = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let Item_id_unique = yield checkuniqueItem_id(body.data);
    if (!Item_id_unique.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: Item_id_unique.message, data: Item_id_unique.data };
        return res;
    }
    let duplicate_itemids = yield duplicateItemIdforItemRecipe(body.data);
    if (!duplicate_itemids.status) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: duplicate_itemids.message, data: duplicate_itemids.data };
        return res;
    }
    let res = { status: true, code: 200, type: 'success', message: 'all validations passed', data: [] };
    return res;
});
exports.semifiniedrecipeSaveUpdate = semifiniedrecipeSaveUpdate;
/**check all menu ids should same in body array */
let checkuniqueMenu_id = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let menu_id = body.map((ele) => { return ele.menu_id; });
    let unique = menu_id.every((val, i, arr) => val === arr[0]);
    if (unique) {
        let res = { status: true, message: 'menuids are unique', data: menu_id };
        return res;
    }
    let res = { status: false, message: 'menuids are not unique', data: menu_id };
    return res;
});
/**check any item ids are duplicate or not */
let duplicateItemId = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let item_id = body.map((ele) => { return ele.item_id; });
    let duplicateitems = item_id.filter((e, i, a) => a.indexOf(e) !== i);
    if (duplicateitems.length > 0) {
        let res = { status: false, message: 'duplicate items are found', data: item_id };
        return res;
    }
    let res = { status: true, message: 'duplicate items are not found', data: item_id };
    return res;
});
/**check all brand ids should same in body array */
let checkuniqueBrand_id = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let brand_id = body.map((ele) => { return ele.brand_id; });
    let unique = brand_id.every((val, i, arr) => val === arr[0]);
    if (unique) {
        let res = { status: true, message: 'brandIds are unique', data: brand_id };
        return res;
    }
    let res = { status: false, message: 'brandIds are not unique', data: brand_id };
    return res;
});
/**check all item ids should same in body array */
let checkuniqueItem_id = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let item_id = body.map((ele) => { return ele.item_id; });
    let unique = item_id.every((val, i, arr) => val === arr[0]);
    if (unique) {
        let res = { status: true, message: 'itemids are unique', data: item_id };
        return res;
    }
    let res = { status: false, message: 'itemids are not unique', data: item_id };
    return res;
});
/**check any item ids are duplicate or not */
let duplicateItemIdforItemRecipe = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let masterItem_id = body.map((ele) => { return ele.masterItem_id; });
    let duplicateitems = masterItem_id.filter((e, i, a) => a.indexOf(e) !== i);
    if (duplicateitems.length > 0) {
        let res = { status: false, message: 'duplicate recipeitems are found', data: masterItem_id };
        return res;
    }
    let res = { status: true, message: 'duplicate recipeitems are not found', data: masterItem_id };
    return res;
});
//# sourceMappingURL=recipeValidator.js.map