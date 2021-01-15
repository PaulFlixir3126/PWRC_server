"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierRoute = void 0;
const express_1 = require("express");
const supplierController_1 = require("../controllers/supplierController");
class supplierRoute {
    constructor() {
        this.supplier = new supplierController_1.supplierController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.supplier.supplierData)
            .get(this.supplier.returnSupplierData)
            .put(this.supplier.updateSupplierData)
            .delete(this.supplier.removeSupplierData);
    }
}
exports.supplierRoute = supplierRoute;
//# sourceMappingURL=supplierRoute.js.map