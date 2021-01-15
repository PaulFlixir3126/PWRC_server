"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifierGroupRoute = void 0;
const express_1 = require("express");
const modifierGroupController_1 = require("../controllers/modifierGroupController");
class modifierGroupRoute {
    constructor() {
        this.modifierGroup = new modifierGroupController_1.modifierGroupController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.modifierGroup.modifierGroupData)
            .get(this.modifierGroup.returnModifierGroupData)
            .delete(this.modifierGroup.deleteModifierGroupData)
            .put(this.modifierGroup.updateModifierGroupData);
    }
}
exports.modifierGroupRoute = modifierGroupRoute;
//# sourceMappingURL=modifierGroupRoute.js.map