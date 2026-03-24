import ActionFactory from "@application/pipelineAction/actionFactory";
import { Payload } from "@core/dto/jobs/jobRequest.dto";
import ActionType from "@core/enum/actionType.enum";
export async function runAction(
  actionType: ActionType,
  payload: Payload,
): Promise<Payload> {
  const action = ActionFactory.create(actionType);
  return await withRetry(() => action.execute(payload), {
    attempts: 3,
    delayMs: 1000,
  });
}

async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { attempts: number; delayMs: number },
): Promise<T> {
  let lastError: unknown;
  for (let i = 1; i <= opts.attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < opts.attempts) {
        console.warn(
          `Action attempt ${i} failed, retrying in ${opts.delayMs}ms...`,
        );
        await new Promise((r) => setTimeout(r, opts.delayMs * i)); // linear backoff
      }
    }
  }
  throw lastError;
}
