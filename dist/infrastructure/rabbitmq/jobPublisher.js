"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publisher_1 = require("./publisher");
class RabbitJobPublisher {
    constructor(channel, exchange, routingKey) {
        this.channel = channel;
        this.exchange = exchange;
        this.routingKey = routingKey;
    }
    async publishJob(payload) {
        await (0, publisher_1.publishJSON)(this.channel, this.exchange, this.routingKey, payload);
    }
}
exports.default = RabbitJobPublisher;
