"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRoute = void 0;
const express_1 = require("express");
const printController_1 = require("../controllers/printController");
class printRoute {
    constructor() {
        this.printing = new printController_1.printController();
        this.Route = express_1.Router();
        this.Route.route("/")
            .post(this.printing.printData)
            .get(this.printing.returnPrintData)
            .delete(this.printing.deletePrintData)
            .put(this.printing.updatePrintData);
    }
}
exports.printRoute = printRoute;
//# sourceMappingURL=printRoute.js.map