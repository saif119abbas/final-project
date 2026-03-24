"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attemptStatus_enum_1 = __importDefault(require("../../core/enum/attemptStatus.enum"));
const models_1 = require("../../core/models");
const enum_1 = require("../../core/enum");
const jobStatus_enum_1 = __importDefault(require("../../core/enum/jobStatus.enum"));
class DeliveryService {
    constructor(subscriberRepository, jobAttemptRepository, jobRepository) {
        this.subscriberRepository = subscriberRepository;
        this.jobAttemptRepository = jobAttemptRepository;
        this.jobRepository = jobRepository;
    }
    async createJobAttempt(job, channel) {
        console.log("Creating attempt...", job);
        if (!job.pipelineId)
            throw new Error("Job pipelineId is missing");
        if (!job.result)
            throw new Error("Job has no result to deliver");
        try {
            const subscribers = await this.subscriberRepository.findByPipelineId(job.pipelineId);
            for (const subscriber of subscribers) {
                // Create attempt record in DB
                const jobAttempt = new models_1.JobAttempt();
                jobAttempt.jobId = job.id;
                jobAttempt.subscriberId = subscriber.id;
                jobAttempt.attemptNumber = 1;
                jobAttempt.status = attemptStatus_enum_1.default.PENDING;
                jobAttempt.responseCode = null;
                jobAttempt.responseBody = null;
                jobAttempt.nextRetryAt = null;
                const attempt = await this.jobAttemptRepository.create(jobAttempt);
                const deliveryMsg = {
                    jobId: job.id,
                    attemptId: attempt.id,
                    subscriberId: subscriber.id,
                    subscriberUrl: subscriber.url,
                    result: job.result,
                    attemptNumber: 1,
                };
                channel.publish(enum_1.Exchanges.DELIVERY, enum_1.RoutingKeys.DELIVERY_ATTEMPT, Buffer.from(JSON.stringify(deliveryMsg)), { persistent: true });
            }
        }
        catch (error) {
            console.error("Delivery setup failed for job", job.id, error);
        }
    }
    ;
    async updateJobDeliveryStatus(attempts, jobId) {
        const total = attempts.length;
        const success = attempts.filter(a => a.status === attemptStatus_enum_1.default.SUCCESS).length;
        const failed = attempts.filter(a => a.status === attemptStatus_enum_1.default.FAILED).length;
        console.log("total", total);
        console.log("success", success);
        console.log("failed", failed);
        /* const active = attempts.filter(a =>
           a.status === AttemptStatus.PENDING ||
           a.status === AttemptStatus.RETRY
         ).length;*/
        let status;
        if (success === total) {
            status = jobStatus_enum_1.default.SUCCESS;
        }
        else if (failed === total) {
            status = jobStatus_enum_1.default.FAILED;
        }
        else if (success > 0 && failed > 0) {
            status = jobStatus_enum_1.default.PARTIAL;
        }
        else {
            status = jobStatus_enum_1.default.PROCESSING;
        }
        await this.jobRepository.update(jobId, { status });
    }
}
exports.default = DeliveryService;
