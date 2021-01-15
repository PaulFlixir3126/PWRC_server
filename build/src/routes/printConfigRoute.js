"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printConfigRoute = void 0;
const express_1 = require("express");
const printConfigController_1 = require("../controllers/printConfigController");
class printConfigRoute {
    constructor() {
        this.print = new printConfigController_1.printConfigController();
        this.Route = express_1.Router();
        this.Route.route("/")
            .post(this.print.printerData)
            .get(this.print.returnPrinterData)
            .delete(this.print.deletePrinterData)
            .put(this.print.updatePrinterData);
    }
}
exports.printConfigRoute = printConfigRoute;
//# sourceMappingURL=printConfigRoute.js.map