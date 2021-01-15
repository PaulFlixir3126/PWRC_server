"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMenuRoute = void 0;
const express_1 = require("express");
const newMenuController_1 = require("../controllers/newMenuController");
class newMenuRoute {
    constructor() {
        this.menu = new newMenuController_1.newMenuController();
        this.Route = express_1.Router();
        this.Route.route("/")
            .post(this.menu.menuData)
            .get(this.menu.returnMenuData)
            .delete(this.menu.deleteMenuData)
            .put(this.menu.updateMenuData);
        this.Route.route("/search")
            .get(this.menu.searchMenus);
    }
}
exports.newMenuRoute = newMenuRoute;
//# sourceMappingURL=newMenuRoute.js.map