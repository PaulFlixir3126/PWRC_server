"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemGroupRoute = void 0;
const express_1 = require("express");
const menuItemGroupController_1 = require("../controllers/menuItemGroupController");
class menuItemGroupRoute {
    constructor() {
        this.menuItemGroup = new menuItemGroupController_1.menuItemGroupController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.menuItemGroup.menuItemGroupData)
            .get(this.menuItemGroup.returnMenuItemGroupData)
            .delete(this.menuItemGroup.deleteMenuItemGroupData)
            .put(this.menuItemGroup.updateMenuItemGroupData);
    }
}
exports.menuItemGroupRoute = menuItemGroupRoute;
//# sourceMappingURL=menuItemGroupRoute.js.map