"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkall = exports.includesIn = exports.checkIsInputObjectContainsUnknownKeys = exports.checkIsSet = exports.checkIsArrayAndNotEmpty = exports.checkIsObjectAndNotEmpty = void 0;
const util_1 = require("util");
const checkIsObjectAndNotEmpty = (input) => {
    return util_1.isObject(input) && Object.keys(input).length > 0;
};
exports.checkIsObjectAndNotEmpty = checkIsObjectAndNotEmpty;
const checkIsArrayAndNotEmpty = (input) => {
    return (util_1.isArray(input) && input.length > 0);
};
exports.checkIsArrayAndNotEmpty = checkIsArrayAndNotEmpty;
const checkIsSet = (input) => {
    return !util_1.isNullOrUndefined(input);
};
exports.checkIsSet = checkIsSet;
const checkIsInputObjectContainsUnknownKeys = (arr1, arr2) => {
    let difference = arr1.filter((x) => !arr2.includes(x));
    return (util_1.isArray(difference) && difference.length > 0) ? true : false;
};
exports.checkIsInputObjectContainsUnknownKeys = checkIsInputObjectContainsUnknownKeys;
const includesIn = (value, arr) => {
    if (arr.includes(value)) {
        return true;
    }
    return false;
};
exports.includesIn = includesIn;
let checkall = (arr, target) => target.every((v) => arr.includes(v));
exports.checkall = checkall;
//# sourceMappingURL=genericValidator.js.map