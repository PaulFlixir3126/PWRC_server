"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.givRoute = void 0;
const express_1 = require("express");
const givController_1 = require("../controllers/givController");
class givRoute {
    constructor() {
        this.giv = new givController_1.givController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.giv.addGiv)
            .get(this.giv.getGiv);
        this.Route.route('/confirm')
            .put(this.giv.confirm_issued_item);
    }
}
exports.givRoute = givRoute;
//# sourceMappingURL=givRoute.js.map