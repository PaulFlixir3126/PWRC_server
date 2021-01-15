"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("./swagger");
const response_1 = require("../lib/response");
const customerRoute_1 = require("./customerRoute");
const scriptRoute_1 = require("./scriptRoute");
const complaintsRoute_1 = require("./complaintsRoute");
class routes {
    constructor() {
        this.swaggerRoute = new swagger_1.swaggerRoute().Route;
        this.customerRoute = new customerRoute_1.customerRoute().Route;
        this.script = new scriptRoute_1.scriptRoute().Route;
        this.complaints = new complaintsRoute_1.complaintsRoute().Route;
    }
    routes(app) {
        app.use('/', this.swaggerRoute);
        app.use('/customers', this.customerRoute);
        app.use('/scripts', this.script);
        app.use('/complaints', this.complaints);
        app.use('/db', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // await sequelize.drop();
                response_1.success(res, 'its not valid');
            }
            catch (err) {
                next({ body: err });
            }
        }));
    }
}
exports.default = routes;
//# sourceMappingURL=allRoute.js.map