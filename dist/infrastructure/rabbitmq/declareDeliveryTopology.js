"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RETRY_TIERS = void 0;
exports.declareDeliveryTopology = declareDeliveryTopology;
const enum_1 = require("../../core/enum");
const RETRY_TIERS = [
    { queue: enum_1.Queues.RETRY_10S, routingKey: enum_1.RoutingKeys.DELIVERY_RETRY_10S, ttl: 5000 },
    { queue: enum_1.Queues.RETRY_30S, routingKey: enum_1.RoutingKeys.DELIVERY_RETRY_30S, ttl: 10000 },
    { queue: enum_1.Queues.RETRY_2M, routingKey: enum_1.RoutingKeys.DELIVERY_RETRY_2M, ttl: 15000 },
];
exports.RETRY_TIERS = RETRY_TIERS;
async function declareDeliveryTopology(ch) {
    await ch.assertExchange(enum_1.Exchanges.DELIVERY, "direct", { durable: true });
    await ch.assertExchange(enum_1.Exchanges.DELIVERY_RETRY, "topic", { durable: true });
    await ch.assertQueue(enum_1.Queues.DELIVERY_ATTEMPTS, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": enum_1.Exchanges.DELIVERY_RETRY,
        },
    });
    await ch.bindQueue(enum_1.Queues.DELIVERY_ATTEMPTS, enum_1.Exchanges.DELIVERY, enum_1.RoutingKeys.DELIVERY_ATTEMPT);
    for (const { queue, routingKey, ttl } of RETRY_TIERS) {
        await ch.assertQueue(queue, {
            durable: true,
            arguments: {
                "x-message-ttl": ttl,
                "x-dead-letter-exchange": enum_1.Exchanges.DELIVERY,
                "x-dead-letter-routing-key": enum_1.RoutingKeys.DELIVERY_ATTEMPT,
            },
        });
        await ch.bindQueue(queue, enum_1.Exchanges.DELIVERY_RETRY, routingKey);
    }
    console.log("Delivery topology declared");
}
