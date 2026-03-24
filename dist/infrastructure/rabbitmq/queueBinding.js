"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declareAndBind = declareAndBind;
const simpleQueueType_enum_1 = __importDefault(require("../../core/enum/simpleQueueType.enum"));
async function declareAndBind(conn, exchange, queueName, key, queueType) {
    const channel = await conn.createChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });
    const options = {
        durable: queueType === simpleQueueType_enum_1.default.Durable,
        autoDelete: queueType === simpleQueueType_enum_1.default.Transient,
        exclusive: queueType === simpleQueueType_enum_1.default.Transient,
    };
    const queue = await channel.assertQueue(queueName, options);
    await channel.bindQueue(queue.queue, exchange, key);
    return [channel, queue];
}
