import ActionFactory from "@application/pipelineAction/actionFactory";
import { Payload } from "@core/dto/jobs/jobRequest.dto";
import ActionType from "@core/enum/actionType.enum";
export async function runAction(
  actionType: ActionType,
  payload: Payload,
): Promise<Payload> {
  const action = ActionFactory.create(actionType);
  return await action.execute(payload);
}
