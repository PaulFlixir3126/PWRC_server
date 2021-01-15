"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grvRoute = void 0;
const express_1 = require("express");
const grvController_1 = require("../controllers/grvController");
class grvRoute {
    constructor() {
        this.grv = new grvController_1.grvController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.grv.grvData)
            .get(this.grv.returnGrvData);
        this.Route.route('/warehouse')
            .post(this.grv.WarehousegrvData);
        // this.Route.route('/stock/qunatity')
        //   .patch(this.grv.updateQunatity)
    }
}
exports.grvRoute = grvRoute;
//# sourceMappingURL=grvRoute.js.map