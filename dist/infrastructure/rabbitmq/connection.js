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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRabbitChannel = getRabbitChannel;
const amqp = __importStar(require("amqplib"));
const rabittmq_config_1 = __importDefault(require("../../config/rabittmq.config"));
let connection = null;
let channel = null;
async function getRabbitChannel() {
    if (channel)
        return channel;
    const rabbitUrl = rabittmq_config_1.default.url;
    if (!rabbitUrl) {
        throw new Error("RABBITMQ_URL is not set");
    }
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createConfirmChannel();
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
