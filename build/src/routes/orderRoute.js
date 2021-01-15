"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoute = void 0;
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
class orderRoute {
    constructor() {
        this.order = new orderController_1.orderController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.order.orderData)
            .get(this.order.returnOrderData)
            .delete(this.order.deleteOrderData)
            .put(this.order.updateOrderData);
        this.Route.route('/waiterEncashment').put(this.order.waiterStatusUpdate);
        this.Route.route('/:id').get(this.order.orderDataById);
        this.Route.route('/driver/assign').patch(this.order.driverAssignPOSOrder);
        this.Route.route('/username/update').patch(this.order.usersDetailsUppdateInAllOrder);
    }
}
exports.orderRoute = orderRoute;
//# sourceMappingURL=orderRoute.js.map