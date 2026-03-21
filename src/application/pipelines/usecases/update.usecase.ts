import IUseCase from "@core/shared/useCase";
import IPipelineRepository from "@core/repositories/pipeline";
import { ISubscribersRepository } from "@core/repositories/subscribers";
import PipelineRequest from "@core/dto/pipeline/pipelineRequest.dto";
import PipelineResponse from "@core/dto/pipeline/pipelineRespone.dto";
import { Pipeline, Subscriber } from "@core/models";
import mapper from "@application/shared/mapper/mapper";
import NotFoundError from "@core/errors/notFoundError";
import ForbiddenError from "@core/errors/forbiddenError";
import isDatabaseError from "@application/shared/db/databaseError";
import ConflictError from "@core/errors/conflictError";

type UpdatePipelineOptions = {
  webhookBaseUrl?: string;
};

export default class UpdatePipelineUseCase implements IUseCase<PipelineResponse> {
  constructor(
    private readonly pipelineRepository: IPipelineRepository,
    private readonly subscriberRepository: ISubscribersRepository,
    private readonly options: UpdatePipelineOptions = {},
  ) {}

  async call(
    ownerId: string,
    pipelineId: string,
    data: PipelineRequest,
  ): Promise<PipelineResponse> {
    const existing = await this.pipelineRepository.findById(pipelineId);
    if (!existing) {
      throw new NotFoundError("pipeline", "id", pipelineId);
    }
    if (existing.ownerId !== ownerId) {
      throw new ForbiddenError();
    }

    const updated = await this.pipelineRepository.update(pipelineId, {
      name: data.name,
      description: data.description ?? null,
      actionType: data.actionType,
    });

    const existingSubscribers =
      await this.subscriberRepository.findByPipelineId(pipelineId);

    const incomingSubscribers = data.subscribers;
    let finalSubscribers = existingSubscribers.map((s) => s.url);

    if (incomingSubscribers !== undefined) {
      const deduped = Array.from(new Set(incomingSubscribers));
      const existingByUrl = new Map(existingSubscribers.map((s) => [s.url, s]));
      const desiredSet = new Set(deduped);

      const toAdd = deduped.filter((url) => !existingByUrl.has(url));
      const toRemove = existingSubscribers.filter(
        (s) => !desiredSet.has(s.url),
      );

      for (const url of toAdd) {
        try {
          const subscriber = new Subscriber();
          subscriber.pipelineId = pipelineId;
          subscriber.url = url;
          await this.subscriberRepository.create(
            subscriber as unknown as Omit<
              Subscriber,
              "updatedAt" | "createdAt"
            >,
          );
        } catch (error: unknown) {
          if (isDatabaseError(error) && error.cause.code === "23505") {
            throw new ConflictError("subscriber", "url", url);
          }
          throw error;
        }
      }

      for (const subscriber of toRemove) {
        await this.subscriberRepository.delete(subscriber.id);
      }

      finalSubscribers = deduped;
    }

    const response = mapper.map(updated, Pipeline, PipelineResponse);
    response.ingestUrl = this.buildIngestUrl(updated.sourcePath);
    response.subscribers = finalSubscribers;
    return response;
  }

  private buildIngestUrl(sourcePath: string): string {
    const base = this.options.webhookBaseUrl?.replace(/\/+$/, "");
    if (!base) return `/webhooks/${sourcePath}`;
    return `${base}/webhooks/${sourcePath}`;
  }
}
