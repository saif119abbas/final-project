export interface JobPublisher {
  publishJob(payload: unknown): Promise<void>;
}