"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptRoute = void 0;
const express_1 = require("express");
const scripts_1 = require("../controllers/scripts");
class scriptRoute {
    constructor() {
        this.script = new scripts_1.scriptController();
        this.Route = express_1.Router();
        this.Route.route('/extracoumn').get(this.script.createExtraColumnforExistingTable);
        this.Route.route('/unitpriceUpdates').get(this.script.updateUnitPrice);
        this.Route.route('/deletefulltable').get(this.script.deleteFullTable);
    }
}
exports.scriptRoute = scriptRoute;
//# sourceMappingURL=scriptRoute.js.map