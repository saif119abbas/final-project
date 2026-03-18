import ActionType from "@core/enum/actionType.enum";
import { ActionConfig } from "@core/models/pipeline.model";
import { Payload } from "../jobs/jobRequest.dto";
export default class JobMessage {
  jobId!: string;
  actionType!: ActionType;
  actionConfig!: ActionConfig;
  payload!: Payload;
}
