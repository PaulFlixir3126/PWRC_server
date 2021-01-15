"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dineInRoute = void 0;
const express_1 = require("express");
const dineInController_1 = require("../controllers/dineInController");
class dineInRoute {
    constructor() {
        this.dineIn = new dineInController_1.dineInController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.dineIn.dineInData)
            .get(this.dineIn.returndineInData)
            .put(this.dineIn.updatedineInData)
            .delete(this.dineIn.removedineInData);
    }
}
exports.dineInRoute = dineInRoute;
//# sourceMappingURL=dineInRoute.js.map