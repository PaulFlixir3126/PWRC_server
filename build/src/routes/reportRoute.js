"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoute = void 0;
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
class reportRoute {
    constructor() {
        this.report = new reportController_1.returnReport();
        this.Route = express_1.Router();
        this.Route.route('/').get(this.report.returnReport);
        this.Route.route('/groups').get(this.report.groupBy);
        this.Route.route('/products').get(this.report.productReport);
        this.Route.route('/brands').get(this.report.brandReport);
        this.Route.route('/brands/dates').get(this.report.brandReportByDate);
    }
}
exports.reportRoute = reportRoute;
//# sourceMappingURL=reportRoute.js.map