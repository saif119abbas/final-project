export default interface DeliveryMessage {
  jobId: string;
  attemptId: string;
  subscriberId: string;
  subscriberUrl: string;
  result: unknown;
  attemptNumber: number;
}
