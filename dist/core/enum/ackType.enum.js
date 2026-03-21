"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AckType;
(function (AckType) {
    AckType["ACK"] = "ACK";
    AckType["NACK_REQUEUE"] = "NACK_REQUEUE";
    AckType["NACK_DISCARD"] = "NACK_DISCARD";
})(AckType || (AckType = {}));
exports.default = AckType;
