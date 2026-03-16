"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_QUEUE = void 0;
exports.getRabbitChannel = getRabbitChannel;
exports.publishJson = publishJson;
const amqp = __importStar(require("amqplib"));
let connection = null;
let channel = null;
exports.DEFAULT_QUEUE = "pipeline_jobs";
async function getRabbitChannel() {
    if (channel)
        return channel;
    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl) {
        throw new Error("RABBITMQ_URL is not set");
    }
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    const close = async () => {
        try {
            await channel?.close();
        }
        catch {
            // ignore
        }
        try {
            await connection?.close();
        }
        catch {
            // ignore
        }
        channel = null;
        connection = null;
    };
    process.on("SIGINT", close);
    process.on("SIGTERM", close);
    return channel;
}
async function publishJson(queue, message, options = { persistent: true }) {
    const ch = await getRabbitChannel();
    await ch.assertQueue(queue, { durable: true });
    const payload = Buffer.from(JSON.stringify(message));
    ch.sendToQueue(queue, payload, options);
}
