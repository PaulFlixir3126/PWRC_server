"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsRoute = void 0;
const express_1 = require("express");
const loggerController_1 = require("../controllers/loggerController");
class logsRoute {
    constructor() {
        this.logs = new loggerController_1.logsController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.logs.sendlogs);
    }
}
exports.logsRoute = logsRoute;
//# sourceMappingURL=logsRoute.js.map