"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionType_enum_1 = __importDefault(require("../../core/enum/actionType.enum"));
const foramatText_action_1 = __importDefault(require("./foramatText.action"));
const addMeta_action_1 = __importDefault(require("./addMeta.action"));
const filterFields_action_1 = __importDefault(require("./filterFields.action"));
class ActionFactory {
    static create(type) {
        switch (type) {
            case actionType_enum_1.default.FORMAT_TEXT:
                return new foramatText_action_1.default();
            case actionType_enum_1.default.ADD_META:
                return new addMeta_action_1.default();
            case actionType_enum_1.default.FILTER_FIELDS:
                return new filterFields_action_1.default();
            default:
                throw new Error(`Unsupported action type: ${type}`);
        }
    }
}
exports.default = ActionFactory;
