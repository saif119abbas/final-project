"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jobHandler;
const ackType_enum_1 = __importDefault(require("../../core/enum/ackType.enum"));
const pipelineAction_1 = require("../shared/processors/pipelineAction");
const jobStatus_enum_1 = __importDefault(require("../../core/enum/jobStatus.enum"));
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function jobHandler(message, jobRepository, deliveryService, channel) {
    const job = await jobRepository.findById(message.jobId);
    if (!job)
        return ackType_enum_1.default.NACK_DISCARD;
    if (job.scheduledFor === null || job.scheduledFor > new Date()) {
        return ackType_enum_1.default.NACK_REQUEUE;
    }
    const start = Date.now();
    let result;
    try {
        result = await (0, pipelineAction_1.runAction)(message.actionType, message.payload);
        const elapsed = Date.now() - start;
        if (elapsed < 10000)
            await sleep(10000 - elapsed);
        await jobRepository.update(job.id, { status: jobStatus_enum_1.default.PROCESSING, result: result.data });
        job.result = result.data;
    }
    catch (error) {
        await jobRepository.update(job.id, { status: jobStatus_enum_1.default.FAILED, error: String(error) });
        return ackType_enum_1.default.NACK_DISCARD;
    }
    await deliveryService.createJobAttempt(job, channel);
    return ackType_enum_1.default.ACK;
}
