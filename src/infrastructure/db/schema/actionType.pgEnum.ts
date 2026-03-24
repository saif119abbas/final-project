import ActionType from "@core/enum/actionType.enum";
import { pgEnum } from "drizzle-orm/pg-core";

const actionTypeEnum = pgEnum("action_type", [
  ActionType.FORMAT_TEXT,
  ActionType.ADD_META,
  ActionType.FILTER_FIELDS,
]);
export default actionTypeEnum;
