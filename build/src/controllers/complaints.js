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
exports.complaintsController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class complaintsController {
    savecomplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                response = yield database_1.complaintTable.create(req.body, {
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while adding complaints ",
                    body: error.message
                });
            }
        });
    }
    postsubcomplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                response = yield database_1.subcomplaintTable.create(req.body, {
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while adding complaints ",
                    body: error.message
                });
            }
        });
    }
    getcomplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let query = {};
                if (req.query.complaint_id) {
                    query.complaint_id = req.query.complaint_id;
                }
                response = yield database_1.complaintTable.findAll({
                    where: query
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting complaints ",
                    body: error.message
                });
            }
        });
    }
    getsubcomplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let query = {};
                if (req.query.complaint_id) {
                    query.complaint_id = req.query.complaint_id;
                }
                if (req.query.subcomplaint_id) {
                    query.subcomplaint_id = req.query.subcomplaint_id;
                }
                response = yield database_1.subcomplaintTable.findAll({
                    where: query,
                    include: [
                        { model: database_1.complaintTable },
                    ]
                });
                return response_1.success(res, response);
            }
            catch (error) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while getting subcomplaints ",
                    body: error.message
                });
            }
        });
    }
    updateComplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.complaintTable.update(req.body, {
                    where: { complaint_id: req.body.complaint_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while updating complaints",
                    body: err.message
                });
            }
        });
    }
    updatesubComplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield database_1.subcomplaintTable.update(req.body, {
                    where: { subcomplaint_id: req.body.subcomplaint_id },
                    returning: true
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while updating subcomplaints",
                    body: err.message
                });
            }
        });
    }
    deleteComplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let complaint_id = req.query.complaint_id;
                const complaintresponse = yield database_1.complaintTable.findAll({
                    where: { complaint_id: complaint_id }
                });
                if (complaintresponse.length > 0) {
                    let message = 'you cant delete this, its already added in customer complaints';
                    return res.status(500).send({ status: false, type: 'conflict', message: message, data: [] });
                }
                const response = yield database_1.complaintTable.destroy({
                    where: { complaint_id: complaint_id }
                });
                return response_1.success(res, response);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while deleting complaints",
                    body: err.message
                });
            }
        });
    }
    deletesubComplaints(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let subcomplaint_id = req.query.subcomplaint_id;
                const response = yield database_1.customerComplaints.findAll({
                    where: { subcomplaint_id: {
                            [database_1.Op.contains]: [subcomplaint_id]
                        } }
                });
                if (response.length > 0) {
                    let message = 'you cant delete this, its already added in customer complaints';
                    return res.status(500).send({ status: false, type: 'conflict', message: message, data: [] });
                }
                const subcomplaintresponse = yield database_1.subcomplaintTable.destroy({
                    where: { subcomplaint_id: subcomplaint_id }
                });
                return response_1.success(res, subcomplaintresponse);
            }
            catch (err) {
                next({
                    status: false,
                    type: 'internalServerError',
                    message: "Some error occurred while deleting subcomplaints",
                    body: err.message
                });
            }
        });
    }
}
exports.complaintsController = complaintsController;
//# sourceMappingURL=complaints.js.map