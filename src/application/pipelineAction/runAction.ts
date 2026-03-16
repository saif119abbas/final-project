import ActionFactory from "./actionFactory";
import ActionType from "@core/enum/actionType.enum";
import type { ActionConfig } from "@core/models/pipeline.model";

export async function runAction(
  actionType: ActionType,
  config: ActionConfig,
  payload: unknown
): Promise<unknown> {

  const action = ActionFactory.create(actionType);
  return action.execute(payload, config);
}
