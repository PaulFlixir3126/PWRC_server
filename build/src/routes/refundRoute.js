"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundRoute = void 0;
const express_1 = require("express");
const refundController_1 = require("../controllers/refundController");
class refundRoute {
    constructor() {
        this.refund = new refundController_1.refundController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.refund.refundData)
            .get(this.refund.returnRefundData);
    }
}
exports.refundRoute = refundRoute;
//# sourceMappingURL=refundRoute.js.map