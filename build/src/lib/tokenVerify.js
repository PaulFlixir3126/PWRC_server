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
exports.verifying = void 0;
const request_1 = __importDefault(require("request"));
const globalLogger_1 = __importDefault(require("./globalLogger"));
const ip_1 = __importDefault(require("ip"));
class verifying {
    tokenVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // next()
                globalLogger_1.default.silly(`lastReqPath: ${req.path},lastReqHeaders:${JSON.stringify(req.headers)}`);
                if (req.headers.authorization == undefined || req.headers.authorization == null) {
                    return res.status(400).send({ status: false, message: 'missing token', type: "invalidRequest", data: [] });
                }
                next();
                // let Ip = await ip.address();
                // let build_url = '';
                // let build_url = `http://${process.env.AUTH_URL}/api/auth/verify`;
                // let dev_url = `http://localhost:3403/verify`;
                // if(process.env.authport){
                // 	let Ip = await ip.address();    //client system local ip is different expose ip is different thats why this
                // 	build_url=`http://${Ip}:${process.env.authport}/verify`
                // }else{
                // 	build_url=`http://${process.env.AUTH_URL}/verify`;
                // }
                // console.log("buildurl",build_url)
                // let options = {
                // 	url: build_url,
                // 	headers: {
                // 		Authorization: req.headers.authorization
                // 	}
                // };
                // request(options, function(error, response, body) {
                // 	// console.log("rrrr",response)
                // 	if (error) {
                // 		return	res.status(500).send({ status: 'false', body: error });
                // 	}
                // 	if(response == undefined){
                // 		return res.status(401).send({ status: 'false', body: 'something went wrong' });
                // 	}
                // 	if (response.statusCode == 401) {
                // 		return	res.status(401).send({ status: 'false', body: body });
                // 	} else {
                // 		next();
                // 	}
                // });
            }
            catch (err) {
                return next({ status: false, message: 'Some error occurred while verifying JWT', body: err });
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.headers.authorization == undefined || req.headers.authorization == null) {
                    return { status: false, message: 'missing token' };
                }
                let build_url = '';
                if (process.env.authport) {
                    let Ip = yield ip_1.default.address();
                    build_url = `http://${Ip}:${process.env.authport}`;
                }
                else {
                    build_url = `http://${process.env.AUTH_URL}`;
                }
                console.log("url", build_url);
                // let build_url = `http://13.59.212.186/api/auth`;
                let options = {
                    url: build_url,
                    headers: {
                        Authorization: req.headers.authorization
                    }
                };
                return new Promise((resolve, reject) => {
                    request_1.default(options, (error, response, body) => {
                        if (error) {
                            if (error.code == 'ENOTFOUND') {
                                return resolve({ status: false, message: 'authconnection:ENOTFOUND', data: [] });
                            }
                            return resolve({ status: false, message: error.message, data: [] });
                        }
                        // if (response) {
                        // 	return	resolve('Invalid status code <');
                        // }
                        if (body) {
                            return resolve({ status: true, message: 'ok', data: body });
                        }
                        return resolve({ status: false, message: 'something went wrong', data: [] });
                    });
                });
            }
            catch (err) {
                return { status: false, message: err.messsage };
            }
        });
    }
}
exports.verifying = verifying;
//# sourceMappingURL=tokenVerify.js.map