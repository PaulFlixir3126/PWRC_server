"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockDetailRoute = void 0;
const express_1 = require("express");
const stockdetailController_1 = require("../controllers/stockdetailController");
class stockDetailRoute {
    constructor() {
        this.stockDetail = new stockdetailController_1.stockDetailController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.stockDetail.returnStockDetailsItemData)
            .post(this.stockDetail.createstockdetail);
        this.Route.route('/search')
            .get(this.stockDetail.searchItem);
        this.Route.route('/warehouse/search')
            .get(this.stockDetail.warehousesearchItem);
        this.Route.route('/quantity') //
            .patch(this.stockDetail.updateQunatity);
        this.Route.route('/quantity/reduce')
            .patch(this.stockDetail.reduceQunatity);
        this.Route.route('/sf/stockcount')
            .patch(this.stockDetail.SFitemsStockcounts)
            .get(this.stockDetail.getsfitems);
        // 	this.Route.route('/stockdetail')
        // 	.get(this.masterItem.returnStockDetailsItemData)
        // this.Route.route('/quantity')
        // 	.patch(this.masterItem.updateQunatity);
        // this.Route.route('/quantity/reduce')
        // 	.patch(this.masterItem.reduceQunatity)
    }
}
exports.stockDetailRoute = stockDetailRoute;
//# sourceMappingURL=stockDetailRoute.js.map