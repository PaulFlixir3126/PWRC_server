"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaRoute = void 0;
const express_1 = require("express");
const areaController_1 = require("../controllers/areaController");
class areaRoute {
    constructor() {
        this.area = new areaController_1.areaController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.area.returnAreaData)
            .put(this.area.updateAreaData)
            .delete(this.area.removeAreaData)
            .post(this.area.areaData);
        this.Route.route('/blocks')
            .post(this.area.createBlock)
            .get(this.area.returnBlockData)
            .put(this.area.updateBlockData)
            .delete(this.area.removeBlockData);
        // this.Route.route('/block').get(this.area.areaAndBlockData);
    }
}
exports.areaRoute = areaRoute;
//# sourceMappingURL=areaRoute.js.map