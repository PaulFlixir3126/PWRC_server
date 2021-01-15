"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterItemRoute = void 0;
const express_1 = require("express");
const masterItemController_1 = require("../controllers/masterItemController");
class masterItemRoute {
    constructor() {
        this.masterItem = new masterItemController_1.masterItemController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.masterItem.masterItemData)
            .get(this.masterItem.returnMasterItemData)
            .put(this.masterItem.updateMasterItemData)
            .delete(this.masterItem.removeMasterItemData);
        this.Route.route('/search')
            .get(this.masterItem.searchItem);
        this.Route.route('/search/type')
            .get(this.masterItem.searchItemByType);
        // this.Route.route('/stockdetail')
        // .get(this.masterItem.returnStockDetailsItemData)
        // this.Route.route('/quantity')
        // 	.patch(this.masterItem.updateQunatity);
        // this.Route.route('/quantity/reduce')
        // 	.patch(this.masterItem.reduceQunatity)
        this.Route.route('/script')
            .get(this.masterItem.script);
    }
}
exports.masterItemRoute = masterItemRoute;
//# sourceMappingURL=masterItemRoute.js.map