"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifierCatalogRoute = void 0;
const express_1 = require("express");
const modifierCatalogController_1 = require("../controllers/modifierCatalogController");
class modifierCatalogRoute {
    constructor() {
        this.modifierCatalog = new modifierCatalogController_1.modifierCatalogController();
        this.Route = express_1.Router();
        this.Route.route('/')
            .post(this.modifierCatalog.modifierData)
            .get(this.modifierCatalog.returnModifierData)
            .delete(this.modifierCatalog.deleteModifierData)
            .put(this.modifierCatalog.updateModifierData);
    }
}
exports.modifierCatalogRoute = modifierCatalogRoute;
//# sourceMappingURL=modifierCatalogRoute.js.map