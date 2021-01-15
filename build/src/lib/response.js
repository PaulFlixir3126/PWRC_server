"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidRequest = exports.success = void 0;
const success = (res, result = {}) => {
    const response = {
        status: true,
        message: 'success',
        type: 'ok',
        body: result
    };
    return res.json(response);
};
exports.success = success;
const invalidRequest = (res, result) => {
    const response = {
        status: false,
        type: 'invalid request',
        message: result.message,
        data: result.data
    };
    return res.json(response);
};
exports.invalidRequest = invalidRequest;
//# sourceMappingURL=response.js.map