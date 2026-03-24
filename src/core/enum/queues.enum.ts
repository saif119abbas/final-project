export enum Queues {
  PROCESSING = "jobs.processing",
  DELIVERY_ATTEMPTS = "delivery.attempts",
  RETRY_10S = "delivery.retry.10s",
  RETRY_30S = "delivery.retry.30s",
  RETRY_2M = "delivery.retry.2m",
}
export default Queues;
