"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoute = void 0;
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = multer_1.default({
    storage: storage,
    limits: { fileSize: 500000 },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(false, false);
        }
        cb(null, true);
    }
});
class imageRoute {
    constructor() {
        this.image = new imageController_1.imageController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(upload.single('file'), this.image.imageUpload)
            .get(this.image.getimage)
            .put(upload.single('file'), this.image.updateImage)
            .delete(this.image.deleteImage);
    }
}
exports.imageRoute = imageRoute;
//# sourceMappingURL=imageRoute.js.map