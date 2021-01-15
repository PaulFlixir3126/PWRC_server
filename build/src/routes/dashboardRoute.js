"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
class dashboardRoute {
    constructor() {
        this.dashboard = new dashboardController_1.dashboard();
        this.Route = express_1.Router();
        this.Route.route('/').get(this.dashboard.netSales);
        this.Route.route('/graph').get(this.dashboard.salesGraph);
        this.Route.route('/trends').get(this.dashboard.trendingItem);
        this.Route.route('/trendsyesterday').get(this.dashboard.trendingItem1);
        this.Route.route('/salesSummary').get(this.dashboard.salesSummaryGraph);
    }
}
exports.dashboardRoute = dashboardRoute;
//# sourceMappingURL=dashboardRoute.js.map