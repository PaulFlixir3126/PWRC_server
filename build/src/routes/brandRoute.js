"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRoute = void 0;
const express_1 = require("express");
const brandController_1 = require("../controllers/brandController");
const multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.memoryStorage();
var upload = multer_1.default({ storage: storage });
class brandRoute {
    constructor() {
        this.brand = new brandController_1.brandController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.brand.brandData)
            .get(this.brand.returnBrandData)
            .put(this.brand.updateBrandData)
            .delete(this.brand.deleteBrandData);
        this.Route.route('/branches/:id').get(this.brand.brandBranchData);
        this.Route.route('/transactions')
            .post(this.brand.tabledata)
            .get(this.brand.returnTableData)
            .put(this.brand.updateTableData);
    }
}
exports.brandRoute = brandRoute;
//# sourceMappingURL=brandRoute.js.map