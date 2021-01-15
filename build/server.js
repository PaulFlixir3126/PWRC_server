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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const allRoute_1 = __importDefault(require("./src/routes/allRoute"));
const path_1 = __importDefault(require("path"));
const globalLogger_1 = __importDefault(require("./src/lib/globalLogger"));
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swaggerAPI/PWSC.yaml');
const socket_1 = __importDefault(require("./src/socket/socket"));
const http_1 = __importDefault(require("http"));
const tokenVerify_1 = require("./src/lib/tokenVerify");
class App {
    constructor() {
        this.socket = new socket_1.default();
        // public socket: testController = testController();
        this.port = process.env.PORT || 3000; // our local
        // private port = process.env.PORT || 5001;   // client test server
        // private port = process.env.PORT || 8001;   // client  live server
        this.routes = new allRoute_1.default();
        this.verify = new tokenVerify_1.verifying();
        // this.socket.deleteuser()
        this.express = express_1.default();
        this.express
            .use(cors_1.default())
            .use(morgan_1.default('dev'))
            .use(body_parser_1.default.json({ limit: '50mb' }))
            .use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }))
            .use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
            .set('views', __dirname + '/views')
            .use('/PWSC', express_1.default.static(path_1.default.join(__dirname, './dist/PWSC')))
            .use('/assets', express_1.default.static(path_1.default.join(__dirname, './dist/PWSC/assets')))
            // .use(express.static(__dirname + '/data/img'))
            .use(express_1.default.static('data/img'))
            .use(express_1.default.static(__dirname + '/public'))
            .use(this.verify.tokenVerification)
            .use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Headers', 'token');
            res.header('Access-Control-Max-Age', '3600');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        }));
        // .listen(this.port, () => logger.info(`server on ${this.port}`));
        const httpServer = http_1.default.createServer(this.express);
        this.socket.connectcsocket(httpServer);
        // testController.connectcsocket(httpServer);
        httpServer.listen(this.port, () => globalLogger_1.default.info(`server and socket running on ${this.port}`));
        this.routes.routes(this.express);
        this.express.use((err, req, res, next) => {
            let { message, body, eCode } = err;
            if (!message) {
                err.message = 'Internal Server Error';
            }
            if (!body) {
                err.body = {};
            }
            err.status = false;
            delete err.eCode;
            res.status(eCode || 500).send(err);
            return globalLogger_1.default.error(err);
        });
    }
}
exports.default = new App().express;
//# sourceMappingURL=server.js.map