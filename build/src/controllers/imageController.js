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
exports.imageController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class imageController {
    imageUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image_data = 'data:image/jpeg;base64,' + req.file.buffer.toString('base64');
                const response = yield database_1.ImageUploadTable.create({ image_data });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while uploading image',
                    body: err
                });
            }
        });
    }
    getimage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                let response = yield database_1.ImageUploadTable.findAll({
                    where: { image_id: id }
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching images',
                    body: error
                });
            }
        });
    }
    updateImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const image_data = 'data:image/jpeg;base64,' + req.file.buffer.toString('base64');
                let response = yield database_1.ImageUploadTable.update({ image_data: image_data }, { where: { image_id: id }, returning: true });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while updating images',
                    body: error
                });
            }
        });
    }
    deleteImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let { id } = req.query;
                response = yield database_1.ImageUploadTable.destroy({
                    where: { image_id: id }
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while deleting images',
                    body: error
                });
            }
        });
    }
}
exports.imageController = imageController;
//# sourceMappingURL=imageController.js.map