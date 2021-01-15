"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockRoute = void 0;
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
class stockRoute {
    constructor() {
        this.stock = new stockController_1.stockController();
        this.Route = express_1.Router();
        this.Route.route('/Out').post(this.stock.stockOut);
        this.Route.route('/Out').get(this.stock.getstockOut);
        this.Route.route('/In').post(this.stock.stockIn);
        this.Route.route('/In').get(this.stock.getstockIn);
    }
}
exports.stockRoute = stockRoute;
//# sourceMappingURL=stockRoute.js.map