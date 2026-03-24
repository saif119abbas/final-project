"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const amqplib_1 = __importDefault(require("amqplib"));
const queueBinding_1 = require("../infrastructure/rabbitmq/queueBinding");
const declareDeliveryTopology_1 = require("../infrastructure/rabbitmq/declareDeliveryTopology");
const deliveryConsumer_1 = require("../infrastructure/rabbitmq/deliveryConsumer");
const enum_1 = require("../core/enum");
const jobHandler_1 = __importDefault(require("../application/handlers/jobHandler"));
const ackType_enum_1 = __importDefault(require("../core/enum/ackType.enum"));
const rabittmq_config_1 = __importDefault(require("../config/rabittmq.config"));
const simpleQueueType_enum_1 = __importDefault(require("../core/enum/simpleQueueType.enum"));
const jobs_repository_1 = __importDefault(require("../infrastructure/repositories/jobs.repository"));
const jobAttempt_repository_1 = __importDefault(require("../infrastructure/repositories/jobAttempt.repository"));
const subscripers_repository_1 = __importDefault(require("../infrastructure/repositories/subscripers.repository"));
const deliverToSubscribers_1 = __importDefault(require("../application/handlers/deliverToSubscribers"));
async function main() {
    const connection = await amqplib_1.default.connect(rabittmq_config_1.default.url);
    const [ch, queue] = await (0, queueBinding_1.declareAndBind)(connection, enum_1.Exchanges.JOBS, enum_1.Queues.PROCESSING, enum_1.RoutingKeys.JOB_CREATED, simpleQueueType_enum_1.default.Durable);
    const topologyChannel = await connection.createChannel();
    await (0, declareDeliveryTopology_1.declareDeliveryTopology)(topologyChannel);
    await topologyChannel.close(); // done, don't keep it open
    const deliveryPublishChannel = await connection.createConfirmChannel();
    const jobRepository = new jobs_repository_1.default();
    const jobAttemptRepository = new jobAttempt_repository_1.default();
    const subscriberRepository = new subscripers_repository_1.default();
    const deliveryService = new deliverToSubscribers_1.default(subscriberRepository, jobAttemptRepository, jobRepository);
    await ch.prefetch(10);
    await ch.consume(queue.queue, async (msg) => {
        if (!msg)
            return;
        try {
            const jobMessage = JSON.parse(msg.content.toString());
            const ack = await (0, jobHandler_1.default)(jobMessage, jobRepository, deliveryService, deliveryPublishChannel);
            if (ack === ackType_enum_1.default.ACK)
                ch.ack(msg);
            else if (ack === ackType_enum_1.default.NACK_REQUEUE)
                ch.nack(msg, false, true);
            else
                ch.nack(msg, false, false);
        }
        catch (err) {
            console.error("Job processing failed:", err);
            ch.nack(msg, false, false);
        }
    }, { noAck: false });
    await (0, deliveryConsumer_1.startDeliveryConsumer)(connection, jobAttemptRepository, deliveryService);
    console.log("Worker started, waiting for jobs...");
    const shutdown = async () => {
        await ch.close();
        await deliveryPublishChannel.close();
        await connection.close();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
main().catch((err) => {
    console.error(`Fatal error: ${err.message ?? err}`);
    process.exit(1);
});
