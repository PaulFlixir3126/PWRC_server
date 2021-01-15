"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRoute = void 0;
const express_1 = require("express");
const itemController_1 = require("../controllers/itemController");
class itemRoute {
    constructor() {
        this.item = new itemController_1.itemController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.item.itemData)
            .get(this.item.returnItemData)
            .delete(this.item.deleteItemData)
            .put(this.item.updateItemData);
    }
}
exports.itemRoute = itemRoute;
//# sourceMappingURL=itemRoute.js.map