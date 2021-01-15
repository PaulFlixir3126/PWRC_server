"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodcostRoute = void 0;
const express_1 = require("express");
const foodcost_1 = require("../controllers/foodcost");
class foodcostRoute {
    constructor() {
        this.foodcost = new foodcost_1.foodcostController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.foodcost.foodcost);
        this.Route.route('/test')
            .get(this.foodcost.test);
        this.Route.route('/resipetest')
            .get(this.foodcost.recipetest);
    }
}
exports.foodcostRoute = foodcostRoute;
//# sourceMappingURL=foodcostRoute.js.map