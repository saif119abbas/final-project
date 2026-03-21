"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    url: process.env.RABBITMQ_URL || "amqp://localhost",
    prefetch: 10,
    rertyPollInternalMs: parseInt(process.env.RETRY_POLL_INTERVAL_MS)
};
exports.default = config;
