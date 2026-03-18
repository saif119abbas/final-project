import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";

export default class UppercaseAction implements PipelineAction<string, string> {
  async execute(payload: Payload<string>): Promise<Payload<string>> {
    return {
      ...payload,
      data: payload.data.toUpperCase(),
    };
  }
}
