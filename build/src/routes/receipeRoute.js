"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receipeRoute = void 0;
const express_1 = require("express");
const receipeController_1 = require("../controllers/receipeController");
class receipeRoute {
    constructor() {
        this.recipe = new receipeController_1.receipeController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.recipe.saveReceipe)
            .get(this.recipe.GetReceipe)
            .patch(this.recipe.upadteReceipe)
            .delete(this.recipe.removeRecipes);
        this.Route.route('/Item')
            .post(this.recipe.saveItemReceipe)
            .get(this.recipe.GetItemReceipe)
            .patch(this.recipe.upadteItemReceipe)
            .delete(this.recipe.removeItemRecipes);
        this.Route.route('/grvitems/unitprice')
            .get(this.recipe.grvUnitprice);
    }
}
exports.receipeRoute = receipeRoute;
//# sourceMappingURL=receipeRoute.js.map