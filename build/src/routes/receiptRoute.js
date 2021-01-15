"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptRoute = void 0;
const express_1 = require("express");
const receiptController_1 = require("../controllers/receiptController");
class receiptRoute {
    constructor() {
        this.receipt = new receiptController_1.receiptController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.receipt.receiptData);
    }
}
exports.receiptRoute = receiptRoute;
//# sourceMappingURL=receiptRoute.js.map