"use strict";
/*import DeliveryService from "../../application/handlers/deliverToSubscribers";
import JobAttemptRepository from "../repositories/jobAttempt.repository";
import JobRepository from "../repositories/jobs.repository";
import SubscriberRepository from "../repositories/subscripers.repository";

async function runRetryPoller(
  deliveryService: DeliveryService,
  jobAttemptRepository: JobAttemptRepository,
  subscriberRepository: SubscriberRepository,
  jobRepository: JobRepository
): Promise<void> {
  try {
    const dueAttempts = await jobAttemptRepository.findDueForRetry();
//    console.log(`Retry poller: found ${dueAttempts.length} due attempts`);

    for (const attempt of dueAttempts) {
      const subscriber = await subscriberRepository.findById(attempt.subscriberId!);
      const job = await jobRepository.findById(attempt.jobId!);
      if (!subscriber || !job?.result) continue;
      await deliveryService.attemptDelivery(attempt, subscriber, job.result);
    }
  } catch (err) {
    console.error("Retry poller error:", err);
  }
}
export default async function scheduleRetryPoller(
  deliveryService: DeliveryService,
  jobAttemptRepository: JobAttemptRepository,
  subscriberRepository: SubscriberRepository,
  jobRepository: JobRepository,
  intervalMs: number
) {
  await new Promise(r => setTimeout(r, intervalMs));
  await runRetryPoller(deliveryService, jobAttemptRepository, subscriberRepository, jobRepository);
  scheduleRetryPoller(deliveryService, jobAttemptRepository, subscriberRepository, jobRepository, intervalMs);
}*/ 
