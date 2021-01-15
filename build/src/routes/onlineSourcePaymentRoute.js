"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineSourcePaymentRoute = void 0;
const express_1 = require("express");
const onlineSourcePaymentController_1 = require("../controllers/onlineSourcePaymentController");
class onlineSourcePaymentRoute {
    constructor() {
        this.onlinetSourcePayment = new onlineSourcePaymentController_1.OnlineSourcePaymentController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.onlinetSourcePayment.onlineSourcePayment)
            .get(this.onlinetSourcePayment.getonlineSouncePayment)
            .patch(this.onlinetSourcePayment.updateonlineSouncePayment)
            .delete(this.onlinetSourcePayment.deleteonlineSouncePayment);
    }
}
exports.onlineSourcePaymentRoute = onlineSourcePaymentRoute;
//# sourceMappingURL=onlineSourcePaymentRoute.js.map