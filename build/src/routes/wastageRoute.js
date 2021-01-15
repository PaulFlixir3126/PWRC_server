"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wastageRoute = void 0;
const express_1 = require("express");
const wastageController_1 = require("../controllers/wastageController");
class wastageRoute {
    constructor() {
        this.wasatge = new wastageController_1.wastageController();
        this.Route = express_1.Router();
        this.Route.route('/').post(this.wasatge.addWastage);
        this.Route.route('/').get(this.wasatge.getWastage);
    }
}
exports.wastageRoute = wastageRoute;
//# sourceMappingURL=wastageRoute.js.map