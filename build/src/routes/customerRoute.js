"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
class customerRoute {
    constructor() {
        this.customer = new customerController_1.customerController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.customer.customerData)
            .get(this.customer.returnCustomerData)
            .put(this.customer.updateCustomerData)
            .delete(this.customer.removeCustomerData);
        this.Route.route('/search')
            .get(this.customer.customerSearch);
        this.Route.route('/complaints')
            .post(this.customer.customerComplaints)
            .get(this.customer.getcustomerComplaints)
            .patch(this.customer.updateCustomerComplaints)
            .delete(this.customer.deleteCustomerComplaints);
        this.Route.route('/address')
            .post(this.customer.customerAddressData)
            .patch(this.customer.updateCustomerAddressData);
    }
}
exports.customerRoute = customerRoute;
//# sourceMappingURL=customerRoute.js.map