"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queues = void 0;
var Queues;
(function (Queues) {
    Queues["PROCESSING"] = "jobs.processing";
    Queues["DELIVERY_ATTEMPTS"] = "delivery.attempts";
    Queues["RETRY_10S"] = "delivery.retry.10s";
    Queues["RETRY_30S"] = "delivery.retry.30s";
    Queues["RETRY_2M"] = "delivery.retry.2m";
})(Queues || (exports.Queues = Queues = {}));
exports.default = Queues;
