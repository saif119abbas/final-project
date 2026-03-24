"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerMapper_1 = __importDefault(require("../application/shared/mapper/registerMapper"));
const queueBinding_1 = require("../infrastructure/rabbitmq/queueBinding");
const errorHandler_1 = __importDefault(require("../presentation/middlewares/errorHandler"));
const router_1 = __importDefault(require("../presentation/routes/router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const amqplib_1 = __importDefault(require("amqplib"));
const enum_1 = require("../core/enum");
const rabittmq_config_1 = __importDefault(require("../config/rabittmq.config"));
const simpleQueueType_enum_1 = __importDefault(require("../core/enum/simpleQueueType.enum"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
async function bootstrap() {
    const connection = await amqplib_1.default.connect(rabittmq_config_1.default.url);
    const ch = await connection.createConfirmChannel();
    await (0, queueBinding_1.declareAndBind)(connection, enum_1.Exchanges.JOBS, enum_1.Queues.PROCESSING, enum_1.RoutingKeys.JOB_CREATED, simpleQueueType_enum_1.default.Durable);
    console.log("RabbitMQ exchange and queue ready");
    const app = (0, express_1.default)();
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: "2mb" }));
    app.get("/health", (_req, res) => {
        res.status(200).json({ ok: true });
    });
    const port = Number(process.env.PORT ?? "3000");
    new router_1.default(app, ch);
    (0, registerMapper_1.default)();
    app.use(errorHandler_1.default);
    app.listen(port, () => {
        console.log(`API listening on :${port}`);
    });
    const shutdown = async () => {
        await connection.close();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
bootstrap().catch((err) => {
    console.error(`Fatal startup error: ${err.message ?? err}`);
    process.exit(1);
});
