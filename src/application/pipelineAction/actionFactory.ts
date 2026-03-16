import ActionType from "@core/enum/actionType.enum";
import PipelineAction from "@core/interfaces/actions/pipelineAction";

import UppercaseAction from "./uppercase.action";
import TimestampAction from "./timestamp.action";
import ApiCallAction from "./apiCall.action";

export default class ActionFactory {

  static create(type: ActionType): PipelineAction {

    switch (type) {

      case ActionType.UPPERCASE:
        return new UppercaseAction();

      case ActionType.ADD_TIMESTAMP:
        return new TimestampAction();

      case ActionType.MAKE_API_CALL:
        return new ApiCallAction();

      default:
        throw new Error(`Unsupported action type: ${type}`);
    }
  }
}
