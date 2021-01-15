"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountRoute = void 0;
const express_1 = require("express");
const discountController_1 = require("../controllers/discountController");
class discountRoute {
    constructor() {
        this.discount = new discountController_1.discountController();
        this.Route = express_1.Router();
        this.Route.route("/")
            .post(this.discount.discountData)
            .get(this.discount.returnDiscountData)
            .delete(this.discount.deleteDiscountData)
            .put(this.discount.updateDiscountData);
    }
}
exports.discountRoute = discountRoute;
//# sourceMappingURL=discountRoute.js.map