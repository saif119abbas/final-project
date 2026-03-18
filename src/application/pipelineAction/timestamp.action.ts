import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";
type Timestamped<T> = T & { timestamp: string };

export default class TimestampAction<
  T extends object,
> implements PipelineAction<T, Timestamped<T>> {
  async execute(payload: Payload<T>): Promise<Payload<Timestamped<T>>> {
    return {
      ...payload,
      data: {
        ...payload.data,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
