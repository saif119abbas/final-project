import ActionType from "@core/enum/actionType.enum";
import { pgEnum } from "drizzle-orm/pg-core";

const actionTypeEnum = pgEnum("action_type", [
  ActionType.UPPERCASE,
  ActionType.ADD_TIMESTAMP,
  ActionType.MAKE_API_CALL,
]);
export default actionTypeEnum;
