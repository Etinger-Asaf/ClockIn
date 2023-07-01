"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(statusCode, message, isOperational, status = "failed") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = status;
    }
}
exports.default = BaseError;
