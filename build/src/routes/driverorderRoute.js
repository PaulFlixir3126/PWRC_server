"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverordersRoute = void 0;
const express_1 = require("express");
const drviersordersController_1 = require("../controllers/drviersordersController");
class driverordersRoute {
    constructor() {
        this.discount = new drviersordersController_1.driverordersController();
        this.Route = express_1.Router();
        this.Route.route("/assigndriver")
            .post(this.discount.assignDrivers);
        this.Route.route('/')
            .get(this.discount.gerordersWithDrivers);
    }
}
exports.driverordersRoute = driverordersRoute;
//# sourceMappingURL=driverorderRoute.js.map