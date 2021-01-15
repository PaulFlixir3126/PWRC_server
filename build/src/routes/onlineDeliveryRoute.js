"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineDeliveryRoute = void 0;
const express_1 = require("express");
const onlineDeliveryController_1 = require("../controllers/onlineDeliveryController");
class onlineDeliveryRoute {
    constructor() {
        this.onlineDelivery = new onlineDeliveryController_1.onlineDeliveryController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.onlineDelivery.onlineDeliveryData)
            .get(this.onlineDelivery.returnOnlineDeliveryData)
            .put(this.onlineDelivery.updateOnlineDeliveryData)
            .delete(this.onlineDelivery.removeOnlineDeliveryData);
        this.Route.route('/onlinetype').delete(this.onlineDelivery.removeOnlineData);
    }
}
exports.onlineDeliveryRoute = onlineDeliveryRoute;
//# sourceMappingURL=onlineDeliveryRoute.js.map