"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterCategoryRoute = void 0;
const express_1 = require("express");
const masterCategoryController_1 = require("../controllers/masterCategoryController");
class masterCategoryRoute {
    constructor() {
        this.masterCategory = new masterCategoryController_1.masterCategoryController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.masterCategory.returnMasterCategoryData)
            .put(this.masterCategory.updateMasterCategoryData)
            .delete(this.masterCategory.removeMasterCategoryData)
            .post(this.masterCategory.masterCategoryData);
    }
}
exports.masterCategoryRoute = masterCategoryRoute;
//# sourceMappingURL=masterCategoryRoute.js.map