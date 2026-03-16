import PipelineAction from "@core/interfaces/actions/pipelineAction";
import type { ActionConfig } from "@core/models/pipeline.model";

export default class UppercaseAction implements PipelineAction {

  async execute(payload: unknown, _config: ActionConfig): Promise<unknown> {

    if (typeof payload === "string") {
      return payload.toUpperCase();
    }

    if (payload && typeof payload === "object" && "text" in payload) {
      const value = (payload as { text?: unknown }).text;

      if (typeof value === "string") {
        return {
          ...(payload as Record<string, unknown>),
          text: value.toUpperCase(),
        };
      }
    }

    return payload;
  }
}
