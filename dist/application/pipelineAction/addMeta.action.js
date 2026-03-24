"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MetaAction {
    async execute(payload) {
        return {
            ...payload,
            data: {
                ...payload.data,
                meta: {
                    timestamp: new Date().toISOString(),
                }
            }
        };
    }
}
exports.default = MetaAction;
