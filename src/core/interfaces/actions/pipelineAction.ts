import type { ActionConfig } from "@core/models/pipeline.model";

export default interface PipelineAction {
  execute(payload: unknown, config: ActionConfig): Promise<unknown>;
}