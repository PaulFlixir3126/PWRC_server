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
exports.gReturn = exports.gUpdate = exports.gDelete = exports.gCreate = void 0;
const response_1 = require("./response");
const gCreate = (payload = {}, model, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield model.create(payload);
        return response_1.success(res, response);
    }
    catch (err) {
        next({ body: err });
    }
});
exports.gCreate = gCreate;
const gDelete = (reqQuery = {}, key, model, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = reqQuery;
        let response, query = {};
        if (id) {
            query = { where: { [key]: id } };
            response = yield model.destroy(query);
            return response_1.success(res, response);
        }
        query = { where: {}, truncate: true };
        response = yield model.destroy(query);
        return response_1.success(res, response);
    }
    catch (err) {
        next({ body: err });
    }
});
exports.gDelete = gDelete;
const gUpdate = (payload = {}, key, model, res, next, quit = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield model.update(payload, {
            where: { [key]: payload[key] },
            returning: true
        });
        if (quit) {
            return;
        }
        return response_1.success(res, response);
    }
    catch (err) {
        next({ body: err });
    }
});
exports.gUpdate = gUpdate;
const gReturn = (key = {}, model, res, next, quit = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield model.findAll(key);
        if (quit) {
            return response;
        }
        return response_1.success(res, response);
    }
    catch (err) {
        next({ body: err });
    }
});
exports.gReturn = gReturn;
//# sourceMappingURL=global-crud.js.map