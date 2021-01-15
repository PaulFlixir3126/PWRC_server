"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRoute = void 0;
const express_1 = require("express");
const deliveryController_1 = require("../controllers/deliveryController");
class deliveryRoute {
    constructor() {
        this.delivery = new deliveryController_1.deliveryController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.delivery.deliveryData)
            .get(this.delivery.returnDeliveryData)
            .put(this.delivery.updateDeliveryData)
            .delete(this.delivery.removeDeliveryData);
        this.Route.route('/blocks').get(this.delivery.BlockData);
        this.Route.route('/amount').get(this.delivery.deliveryAmount);
        this.Route.route('/charges')
            .post(this.delivery.deliveryAmountData)
            .get(this.delivery.fetchingDeliveryAmountData)
            .put(this.delivery.updateDeliveryAmountData);
    }
}
exports.deliveryRoute = deliveryRoute;
//# sourceMappingURL=deliveryRoute.js.map