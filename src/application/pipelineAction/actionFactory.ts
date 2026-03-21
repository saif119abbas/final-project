import ActionType from "@core/enum/actionType.enum";
import PipelineAction from "@core/interfaces/actions/pipelineAction";
import FormatTextAction from "./foramatText.action";
import MetaAction from "./addMeta.action";
import FilterFieldsAction from "./filterFields.action";

export default class ActionFactory {
  static create(type: ActionType): PipelineAction {
    switch (type) {
      case ActionType.FORMAT_TEXT:
        return new FormatTextAction();

      case ActionType.ADD_META:
        return new MetaAction();

      case ActionType.FILTER_FIELDS:
        return new FilterFieldsAction();
      default:
        throw new Error(`Unsupported action type: ${type}`);
    }
  }
}
