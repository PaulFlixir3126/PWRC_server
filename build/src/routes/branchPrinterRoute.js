"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchPrinterRoute = void 0;
const express_1 = require("express");
const branchPrinterController_1 = require("../controllers/branchPrinterController");
class branchPrinterRoute {
    constructor() {
        this.branchPrinter = new branchPrinterController_1.branchPrinterController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.branchPrinter.printerData)
            .get(this.branchPrinter.returnPrinterData)
            .put(this.branchPrinter.updatePrinterData);
    }
}
exports.branchPrinterRoute = branchPrinterRoute;
//# sourceMappingURL=branchPrinterRoute.js.map