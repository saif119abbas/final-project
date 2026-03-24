import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";
type MetaData<T> = T & {
  meta: {
    timestamp: string;
  };
};

export default class MetaAction<T extends object> implements PipelineAction<
  T,
  MetaData<T>
> {
  async execute(payload: Payload<T>): Promise<Payload<MetaData<T>>> {
    return {
      ...payload,
      data: {
        ...payload.data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
    };
  }
}
