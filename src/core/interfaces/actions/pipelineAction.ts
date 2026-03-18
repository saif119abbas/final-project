import { Payload } from "@core/dto/jobs/jobRequest.dto";

export default interface PipelineAction<TIn = unknown, TOut = unknown> {
  execute(payload: Payload<TIn>): Promise<Payload<TOut>>;
}
