"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryCatalogRoute = void 0;
const express_1 = require("express");
const categoryCatalogController_1 = require("../controllers/categoryCatalogController");
class categoryCatalogRoute {
    constructor() {
        this.categoryCatalog = new categoryCatalogController_1.categoryCatalogController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.categoryCatalog.categoryData)
            .get(this.categoryCatalog.returnCategoryData)
            .delete(this.categoryCatalog.deleteCategoryData)
            .put(this.categoryCatalog.updateCategoryData);
    }
}
exports.categoryCatalogRoute = categoryCatalogRoute;
//# sourceMappingURL=categoryCatalogRoute.js.map