import { randomUUID } from "crypto";
import IUseCase from "@core/shared/useCase";
import IPipelineRepository  from "@core/repositories/pipeline";
import PipelineRequest from "@core/dto/pipeline/pipelineRequest.dto";
import PipelineResponse from "@core/dto/pipeline/pipelineRespone.dto";
import isDatabaseError from "@application/shared/db/databaseError";
import ConflictError from "@core/errors/conflictError";
import { Pipeline, Subscriber } from "@core/models";
import mapper from "@application/shared/mapper/mapper";
import { ISubscribersRepository } from "@core/repositories/subscribers";

type CreatePipelineOptions = {
  webhookBaseUrl?: string;
  sourcePathPrefix?: string;
};

export default class CreatePipelineUseCase implements IUseCase<PipelineResponse> {
  constructor(
    private readonly pipelineRepository: IPipelineRepository,
    private readonly subscriberRepository: ISubscribersRepository,
    private readonly options: CreatePipelineOptions = {},
  ) {}

  async call(ownerId: string, data: PipelineRequest): Promise<PipelineResponse> {
    const sourcePath = this.generateSourcePath(this.options.sourcePathPrefix);

    try {
      const pipeline: Pipeline = mapper.map(data, PipelineRequest, Pipeline);
      pipeline.ownerId = ownerId;
      pipeline.sourcePath = sourcePath;

      const createdPipeline = await this.pipelineRepository.create(pipeline);

      const subscriberUrls = data.subscribers ?? [];
      for (const url of subscriberUrls) {
        try {
          const subscriber:Subscriber = new Subscriber();
          subscriber.pipelineId = createdPipeline.id;
          subscriber.url = url;
          await this.subscriberRepository.create(
            subscriber as unknown as Omit<Subscriber, "updatedAt" | "createdAt">,
          );
        } catch (error: unknown) {
          if (isDatabaseError(error) && error.cause.code === "23505") {
            throw new ConflictError("subscriber", "url", url);
          }
          throw error;
        }
      }

      const response = mapper.map(
        createdPipeline,
        Pipeline,
        PipelineResponse,
      );
      response.ingestUrl = this.buildIngestUrl(createdPipeline.sourcePath);
      response.subscribers = subscriberUrls;
      return response;
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.cause.code === "23505") {
        throw new ConflictError("pipeline", "sourcePath", sourcePath);
      }
      throw error;
    }
  }

  private generateSourcePath(prefix = "pipe"): string {
    return `${prefix}_${randomUUID().replace(/-/g, "")}`;
  }

  private buildIngestUrl(sourcePath: string): string {
    const base = this.options.webhookBaseUrl?.replace(/\/+$/, "");
    if (!base) return `/webhooks/${sourcePath}`;
    return `${base}/webhooks/${sourcePath}`;
  }
}
