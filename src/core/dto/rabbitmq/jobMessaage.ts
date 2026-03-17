import ActionType from "@core/enum/actionType.enum";
import { ActionConfig } from "@core/models/pipeline.model";
export default class JobMessage  {
  jobId!: string;
  actionType!: ActionType;
  actionConfig!: ActionConfig;
  payload!: unknown;
};