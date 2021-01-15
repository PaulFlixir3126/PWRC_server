"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintsRoute = void 0;
const express_1 = require("express");
const complaints_1 = require("../controllers/complaints");
class complaintsRoute {
    constructor() {
        this.complaints = new complaints_1.complaintsController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.complaints.savecomplaints)
            .get(this.complaints.getcomplaints)
            .patch(this.complaints.updateComplaints)
            .delete(this.complaints.deleteComplaints);
        this.Route.route('/subcomplaints')
            .post(this.complaints.postsubcomplaints)
            .get(this.complaints.getsubcomplaints)
            .patch(this.complaints.updatesubComplaints)
            .delete(this.complaints.deletesubComplaints);
    }
}
exports.complaintsRoute = complaintsRoute;
//# sourceMappingURL=complaintsRoute.js.map