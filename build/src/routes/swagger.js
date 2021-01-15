"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRoute = void 0;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
class swaggerRoute {
    constructor() {
        this.Route = express_1.Router();
        this.viewOptions = {
            title: 'PWSC Swagger',
            description: 'Home page.',
            datasrc: './swagger/json/source.json'
        };
        this.inputfile = './swaggerAPI/PWSC.yaml';
        this.outputfile = './public/swagger/json/source.json';
        this.Route.get('/', (req, res, next) => {
            /** yaml to json */
            const swaggerJson = js_yaml_1.default.load(fs_1.default.readFileSync(this.inputfile, { encoding: 'utf-8' }));
            fs_1.default.writeFileSync(this.outputfile, JSON.stringify(swaggerJson), 'utf8');
            res.render('swagger', this.viewOptions);
        });
    }
}
exports.swaggerRoute = swaggerRoute;
//# sourceMappingURL=swagger.js.map