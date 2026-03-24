import ActionType from "@core/enum/actionType.enum";
import { Payload } from "../jobs/jobRequest.dto";
export default class JobMessage {
  jobId!: string;
  actionType!: ActionType;
  payload!: Payload;
}
