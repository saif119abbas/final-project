import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";
import grammarify from "grammarify";
export default class FormatTextAction implements PipelineAction<
  string,
  string
> {
  async execute(payload: Payload<string>): Promise<Payload<string>> {
    console.log(payload);
    try {
      const result = grammarify.clean(payload.data);
      return {
        ...payload,
        data: result ?? "",
      };
    } catch (err) {
      console.log("err", err);
      throw new Error("Error At Format Action");
    }
  }
}
