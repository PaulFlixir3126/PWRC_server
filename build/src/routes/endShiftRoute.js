"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endShiftRoute = void 0;
const express_1 = require("express");
const endShiftController_1 = require("../controllers/endShiftController");
class endShiftRoute {
    constructor() {
        this.endShift = new endShiftController_1.endShift();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.endShift.shiftData)
            .post(this.endShift.postData)
            .put(this.endShift.updateData);
        this.Route.route('/data').get(this.endShift.endShiftData);
        this.Route.route('/startShift').get(this.endShift.startShiftData);
        this.Route.route('/updateStatus').put(this.endShift.statusUpdate);
    }
}
exports.endShiftRoute = endShiftRoute;
//# sourceMappingURL=endShiftRoute.js.map