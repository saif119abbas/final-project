"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RoutingKeys;
(function (RoutingKeys) {
    RoutingKeys["JOB_CREATED"] = "job.created";
    RoutingKeys["DELIVERY_ATTEMPT"] = "delivery.attempt";
    RoutingKeys["DELIVERY_RETRY_10S"] = "delivery.retry.10s";
    RoutingKeys["DELIVERY_RETRY_30S"] = "delivery.retry.30s";
    RoutingKeys["DELIVERY_RETRY_2M"] = "delivery.retry.2m";
})(RoutingKeys || (RoutingKeys = {}));
exports.default = RoutingKeys;
