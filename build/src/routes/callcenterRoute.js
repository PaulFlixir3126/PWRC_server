"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callcenterRoute = void 0;
const express_1 = require("express");
const callcenterController_1 = require("../controllers/callcenterController");
class callcenterRoute {
    constructor() {
        this.callcenter = new callcenterController_1.callcenterController();
        this.Route = express_1.Router();
        this.Route.route('/orders')
            .post(this.callcenter.savecallcenterorder)
            .get(this.callcenter.getcallcenterorder)
            .patch(this.callcenter.updatecallcenterOrder);
        this.Route.route('/orders/assign')
            .patch(this.callcenter.driverAssign);
        this.Route.route('/orders/Reassign')
            .patch(this.callcenter.driverReAssign);
        this.Route.route('/orders/tranfer')
            .patch(this.callcenter.orderTransfer);
        this.Route.route('/dashboard')
            .get(this.callcenter.callcenterDashboard);
        this.Route.route('/search')
            .get(this.callcenter.callcenterSearch);
        this.Route.route('/dashboard/sales/hoursly')
            .get(this.callcenter.callcenterSalesByHours);
        this.Route.route('/dashboard/sales/daily')
            .get(this.callcenter.callcenterSalesByDaily);
        this.Route.route('/dashboard/users/performances')
            .get(this.callcenter.callcenterUserPerformance);
        this.Route.route('/dashboard/orders-amount/comarissions')
            .get(this.callcenter.callcenterOrderAmountComarission);
        this.Route.route('/dashboard/orders/summary')
            .get(this.callcenter.callcenterOrdersummary);
        this.Route.route('/dashboard/branches/status')
            .get(this.callcenter.callcenterBranchOrders);
        this.Route.route('/reports/customers')
            .get(this.callcenter.callcenterCustomerReports);
        this.Route.route('/reports')
            .get(this.callcenter.searchcallcenterorder);
        this.Route.route('/transactionDates')
            .post(this.callcenter.savecallcenterTransactionDate);
        this.Route.route('/transactionDates')
            .get(this.callcenter.getcallcenterTransactionDate);
        this.Route.route('/transactionDates')
            .patch(this.callcenter.updatecallcenterTransactionDate);
    }
}
exports.callcenterRoute = callcenterRoute;
//# sourceMappingURL=callcenterRoute.js.map