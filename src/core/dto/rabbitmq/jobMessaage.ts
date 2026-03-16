import ActionType from "@core/enum/actionType.enum";
export default class JobMessage  {
  jobId!: string;
  actionType!: ActionType;
  actionConfig!: Record<string, unknown>;
  payload!: unknown;
};