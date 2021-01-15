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
exports.deletecustomercomplaints = exports.updatecustomercomplaints = exports.customercomplaintpost = exports.deletecustomer = exports.updatecustomer = exports.customerDataPOST = void 0;
const genericValidator_1 = require("../validators/genericValidator");
const logger_1 = __importDefault(require("../lib/logger"));
const database_1 = require("../db/database");
let arr = ["phone_no", "customer_name"];
const customerDataPOST = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), arr);
    if (!found) {
        return {
            status: false,
            code: 400,
            type: "invalidRequest",
            message: "mandatory fileds are missing",
            data: arr
        };
    }
    // let getarea: any = await GlobalAreaTable.findAll({
    //   where: { area_id: req.body.area_id }
    // });
    // if (getarea.length == 0) {
    //   return {
    //     status: false,
    //     code: 404,
    //     type: "NotFound",
    //     message: "area id NotFound ",
    //     data: req.body.area_id
    //   };
    // }
    // let getblock: any = await BlockTable.findAll({
    //   where: { area_id: req.body.area_id, block_id: req.body.block_id }
    // });
    // if (getblock.length == 0) {
    //   return {
    //     status: false,
    //     code: 404,
    //     type: "NotFound",
    //     message: "area and block are nonrelated",
    //     data: req.body.block_id
    //   };
    // }
    let checkinPh = yield database_1.CustomerTable.findAll({
        where: { phone_no: req.body.phone_no }
    });
    if (checkinPh.length > 0) {
        return {
            status: false,
            code: 309,
            type: "Conflict",
            message: "phone_no already exist",
            data: req.body.phone
        };
    }
    if (req.body.phone_no2 !== '') {
        let checkinPh2 = yield database_1.CustomerTable.findAll({
            where: { phone_no2: req.body.phone_no2 }
        });
        if (checkinPh2.length > 0) {
            return {
                status: false,
                code: 309,
                type: "Conflict",
                message: "phone_no2 already exist",
                data: req.body.phone
            };
        }
    }
    if (req.body.phone_no3 !== '') {
        let checkinPh3 = yield database_1.CustomerTable.findAll({
            where: { phone_no3: req.body.phone_no3 }
        });
        if (checkinPh3.length > 0) {
            return {
                status: false,
                code: 309,
                type: "Conflict",
                message: "phone_no3 already exist",
                data: req.body.phone
            };
        }
    }
    logger_1.default.info("customerDataPOST: all validations passed");
    let res = {
        status: true,
        code: 200,
        type: "success",
        message: "all validations passed",
        data: []
    };
    return res;
});
exports.customerDataPOST = customerDataPOST;
const updatecustomer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), ["customer_id"]);
    if (!found) {
        return { status: false, code: 400, type: "invalidRequest", message: "mandatory fileds are missing", data: arr };
    }
    let getcustomer = yield database_1.CustomerTable.findAll({
        where: { customer_id: req.body.customer_id }
    });
    if (getcustomer.length == 0) {
        return { status: false, code: 404, type: "NotFound", message: "customer id NotFound ", data: req.body.customer_id };
    }
    logger_1.default.info("updatecustomer: all validations passed");
    let res = { status: true, code: 200, type: "success", message: "all validations passed", data: [] };
    return res;
});
exports.updatecustomer = updatecustomer;
const deletecustomer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.query), ["id"]);
    if (!found) {
        return { status: false, code: 400, type: "invalidRequest", message: "mandatory fileds are missing", data: arr };
    }
    let getcustomer = yield database_1.CustomerTable.findAll({ where: { customer_id: req.query.id } });
    if (getcustomer.length == 0) {
        return { status: false, code: 404, type: "NotFound", message: "customer id NotFound ", data: req.body.customer_id };
    }
    logger_1.default.info("deletecustomer: all validations passed");
    let res = { status: true, code: 200, type: "success", message: "all validations passed", data: [] };
    return res;
});
exports.deletecustomer = deletecustomer;
const customercomplaintpost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!genericValidator_1.checkIsArrayAndNotEmpty(req.body)) {
        let res = { status: false, code: 400, type: 'invalidRequest', message: 'body should be non empty array', data: [] };
        return res;
    }
    for (let i = 0; i < req.body.length; i++) {
        let mandatory = ["order_id", "complaint_id", "customer_id", "brand_id", "branch_id"];
        let found = genericValidator_1.checkall(Object.keys(req.body[i]), mandatory);
        if (!found) {
            return { status: false, code: 400, type: "invalidRequest", message: "mandatory fileds are missing", data: mandatory };
        }
        let getcomplaint = yield database_1.complaintTable.findAll({ where: { complaint_id: req.body[i].complaint_id } });
        if (getcomplaint.length == 0) {
            return { status: false, code: 404, type: "NotFound", message: "complaint id NotFound or unrelated", data: req.body[i].complaint_id };
        }
        let getcustomer = yield database_1.CustomerTable.findAll({ where: { customer_id: req.body[i].customer_id } });
        if (getcustomer.length == 0) {
            return { status: false, code: 404, type: "NotFound", message: "customer id NotFound ", data: req.body[i].customer_id };
        }
        let getcustomercomplaint = yield database_1.customerComplaints.findAll({ where: { customer_id: req.body[i].customer_id, order_id: req.body[i].order_id, complaint_id: req.body[i].complaint_id } });
        if (getcustomercomplaint.length > 0) {
            return { status: false, code: 409, type: "Conflicts", message: "complaint already rised", data: req.body[i].complaint_id };
        }
        if (req.body.length - 1 == i) {
            logger_1.default.info("customercomplaintpost: all validations passed");
            return { status: true, code: 200, type: "success", message: "all validations passed", data: [] };
        }
    }
});
exports.customercomplaintpost = customercomplaintpost;
const updatecustomercomplaints = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.body), ["order_id", "complaint_id", "customer_id"]);
    if (!found) {
        return { status: false, code: 400, type: "invalidRequest", message: "mandatory fileds are missing", data: arr };
    }
    let getcomplaints = yield database_1.complaintTable.findAll({
        where: { complaint_id: req.body.complaint_id }
    });
    if (getcomplaints.length == 0) {
        return { status: false, code: 404, type: "NotFound", message: "complaint_id NotFound ", data: req.body.complaint_id };
    }
    logger_1.default.info("updatecustomercomplaints: all validations passed");
    let res = { status: true, code: 200, type: "success", message: "all validations passed", data: [] };
    return res;
});
exports.updatecustomercomplaints = updatecustomercomplaints;
const deletecustomercomplaints = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let found = genericValidator_1.checkall(Object.keys(req.query), ["customer_complaint_id"]);
    if (!found) {
        return { status: false, code: 400, type: "invalidRequest", message: "mandatory fileds are missing", data: arr };
    }
    let getcustomercomplaints = yield database_1.customerComplaints.findAll({
        where: { customer_complaint_id: req.query.customer_complaint_id }
    });
    if (getcustomercomplaints.length == 0) {
        return { status: false, code: 404, type: "NotFound", message: "customer complaint id NotFound ", data: req.query.customer_id };
    }
    logger_1.default.info("deletecustomercomplaints: all validations passed");
    let res = { status: true, code: 200, type: "success", message: "all validations passed", data: [] };
    return res;
});
exports.deletecustomercomplaints = deletecustomercomplaints;
//# sourceMappingURL=customerValidator.js.map