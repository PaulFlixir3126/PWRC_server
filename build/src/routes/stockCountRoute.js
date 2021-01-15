"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockcountRoute = void 0;
const express_1 = require("express");
const stockCountController_1 = require("../controllers/stockCountController");
class stockcountRoute {
    constructor() {
        this.stockcountController = new stockCountController_1.stockcountController();
        this.Route = express_1.Router();
        this.Route.route('/').post(this.stockcountController.stockcount);
        this.Route.route('/').get(this.stockcountController.getstockcount);
        this.Route.route('/').patch(this.stockcountController.updatestockcount);
    }
}
exports.stockcountRoute = stockcountRoute;
//# sourceMappingURL=stockCountRoute.js.map