"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchRoute = void 0;
const express_1 = require("express");
const branchController_1 = require("../controllers/branchController");
class branchRoute {
    constructor() {
        this.branch = new branchController_1.branchController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.branch.branchData)
            .get(this.branch.returnBranchData)
            .put(this.branch.updateBranchData)
            .delete(this.branch.deleteBranchData);
    }
}
exports.branchRoute = branchRoute;
//# sourceMappingURL=branchRoute.js.map