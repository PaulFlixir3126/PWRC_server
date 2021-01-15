"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerRoute = void 0;
const express_1 = require("express");
const managerController_1 = require("../controllers/managerController");
class managerRoute {
    constructor() {
        this.managerController = new managerController_1.managerController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.managerController.managerData)
            .get(this.managerController.returnManagerData);
    }
}
exports.managerRoute = managerRoute;
//# sourceMappingURL=managerRoute.js.map