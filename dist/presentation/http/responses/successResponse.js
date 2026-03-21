"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.created = created;
exports.noContent = noContent;
const httpStatusSuccess_1 = require("../../../core/enum/httpStatusSuccess");
function ok(res, options) {
    res.status(httpStatusSuccess_1.HttpStatusSuccess.OK).json({
        success: true,
        message: options.message,
        data: options.data,
    });
}
function created(res, options) {
    res.status(httpStatusSuccess_1.HttpStatusSuccess.CREATED).json({
        success: true,
        message: options.message,
        data: options.data,
    });
}
function noContent(res) {
    res.sendStatus(httpStatusSuccess_1.HttpStatusSuccess.NO_CONTENT);
}
