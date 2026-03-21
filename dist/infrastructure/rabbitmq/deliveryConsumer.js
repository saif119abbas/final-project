"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDeliveryConsumer = startDeliveryConsumer;
const enum_1 = require("../../core/enum");
const declareDeliveryTopology_1 = require("./declareDeliveryTopology");
const attemptStatus_enum_1 = __importDefault(require("../../core/enum/attemptStatus.enum"));
const MAX_RETRIES = 5;
function getRetryRoutingKey(attemptNumber) {
    if (attemptNumber <= 2)
        return enum_1.RoutingKeys.DELIVERY_RETRY_10S;
    if (attemptNumber === 3)
        return enum_1.RoutingKeys.DELIVERY_RETRY_30S;
    return enum_1.RoutingKeys.DELIVERY_RETRY_2M;
}
async function getAttempts(jobAttemptRepository, jobId) {
    return await jobAttemptRepository.findByJobId(jobId);
}
async function allAttemptsSettled(attempts) {
    return attempts.every(a => a.status === attemptStatus_enum_1.default.SUCCESS || a.status === attemptStatus_enum_1.default.FAILED);
}
async function startDeliveryConsumer(connection, jobAttemptRepository, deliveryService) {
    const ch = await connection.createChannel();
    await ch.prefetch(10);
    await ch.consume(enum_1.Queues.DELIVERY_ATTEMPTS, async (msg) => {
        if (!msg)
            return;
        const delivery = JSON.parse(msg.content.toString());
        console.log(`Delivery attempt ${delivery.attemptNumber} for job ${delivery.jobId}`);
        let responseCode = null;
        let responseBody = null;
        let errorMessage = null;
        let succeeded = false;
        try {
            const response = await fetch(delivery.subscriberUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(delivery.result),
            });
            responseCode = String(response.status);
            responseBody = await response.text();
            succeeded = response.ok;
            if (!succeeded) {
                errorMessage = `HTTP ${response.status}: ${responseBody}`;
            }
        }
        catch (err) {
            errorMessage = String(err);
        }
        // ── Terminal: success ───────────────────────────────────────────
        if (succeeded) {
            await jobAttemptRepository.update(delivery.attemptId, {
                status: attemptStatus_enum_1.default.SUCCESS,
                responseCode,
                responseBody,
                nextRetryAt: null,
            });
            ch.ack(msg);
            console.log(`Delivery succeeded for attempt ${delivery.attemptId}`);
            const attempts = await getAttempts(jobAttemptRepository, delivery.jobId);
            if (await allAttemptsSettled(attempts)) {
                console.log("succeeded");
                await deliveryService.updateJobDeliveryStatus(attempts, delivery.jobId);
            }
            return;
        }
        // ── Terminal: exhausted retries ─────────────────────────────────
        const exhausted = delivery.attemptNumber >= MAX_RETRIES;
        if (exhausted) {
            console.log("exhausted");
            await jobAttemptRepository.update(delivery.attemptId, {
                status: attemptStatus_enum_1.default.FAILED,
                responseCode,
                responseBody: errorMessage,
                nextRetryAt: null,
            });
            console.warn(`Delivery exhausted after ${MAX_RETRIES} attempts for job ${delivery.jobId}`);
            const attempts = await getAttempts(jobAttemptRepository, delivery.jobId);
            console.log("attempts", attempts);
            if (await allAttemptsSettled(attempts)) {
                await deliveryService.updateJobDeliveryStatus(attempts, delivery.jobId);
            }
            ch.ack(msg);
            return;
        }
        // ── Non-terminal: schedule retry ────────────────────────────────
        const nextAttemptNumber = delivery.attemptNumber + 1;
        const retryRoutingKey = getRetryRoutingKey(nextAttemptNumber);
        const tier = declareDeliveryTopology_1.RETRY_TIERS.find(t => t.routingKey === retryRoutingKey);
        const nextRetryAt = new Date(Date.now() + tier.ttl);
        await jobAttemptRepository.update(delivery.attemptId, {
            status: attemptStatus_enum_1.default.RETRY,
            attemptNumber: nextAttemptNumber,
            responseCode,
            responseBody: errorMessage,
            nextRetryAt,
        });
        const retryMsg = {
            ...delivery,
            attemptNumber: nextAttemptNumber,
        };
        ch.publish(enum_1.Exchanges.DELIVERY_RETRY, retryRoutingKey, Buffer.from(JSON.stringify(retryMsg)), { persistent: true });
        console.log(`Delivery failed (attempt ${delivery.attemptNumber}), ` +
            `retrying as attempt ${nextAttemptNumber} via ${retryRoutingKey} ` +
            `(${tier.ttl / 1000}s delay)`);
        ch.ack(msg);
    }, { noAck: false });
    console.log("Delivery consumer started");
}
