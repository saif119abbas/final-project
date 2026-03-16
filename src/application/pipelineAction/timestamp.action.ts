import PipelineAction from "@core/interfaces/actions/pipelineAction";
import type { ActionConfig } from "@core/models/pipeline.model";

export default class TimestampAction implements PipelineAction {

  async execute(payload: unknown, _config: ActionConfig): Promise<unknown> {

    const timestamp = new Date().toISOString();

    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      return {
        ...(payload as Record<string, unknown>),
        timestamp
      };
    }

    return { payload, timestamp };
  }
}
