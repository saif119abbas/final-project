"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAction = runAction;
const actionFactory_1 = __importDefault(require("../../pipelineAction/actionFactory"));
async function runAction(actionType, payload) {
    const action = actionFactory_1.default.create(actionType);
    return await withRetry(() => action.execute(payload), { attempts: 3, delayMs: 1000 });
}
async function withRetry(fn, opts) {
    let lastError;
    for (let i = 1; i <= opts.attempts; i++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            if (i < opts.attempts) {
                console.warn(`Action attempt ${i} failed, retrying in ${opts.delayMs}ms...`);
                await new Promise(r => setTimeout(r, opts.delayMs * i)); // linear backoff
            }
        }
    }
    throw lastError;
}
