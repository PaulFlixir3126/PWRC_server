"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalCardRoute = void 0;
const express_1 = require("express");
const globalCardController_1 = require("../controllers/globalCardController");
class globalCardRoute {
    constructor() {
        this.cardTypes = new globalCardController_1.globalCardController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .get(this.cardTypes.fetchCardData)
            .post(this.cardTypes.cardData);
    }
}
exports.globalCardRoute = globalCardRoute;
//# sourceMappingURL=globalCardRoute.js.map