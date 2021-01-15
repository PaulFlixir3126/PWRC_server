"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseRoute = void 0;
const express_1 = require("express");
const warehouseController_1 = require("../controllers/warehouseController");
class warehouseRoute {
    constructor() {
        this.wareHouse = new warehouseController_1.warhouseController();
        this.Route = express_1.Router();
        this.Route.route('/').post(this.wareHouse.addWarehouse);
        this.Route.route('/').get(this.wareHouse.getWarehouses);
        this.Route.route('/').put(this.wareHouse.updateWarehouse);
    }
}
exports.warehouseRoute = warehouseRoute;
//# sourceMappingURL=warehouseRoute.js.map