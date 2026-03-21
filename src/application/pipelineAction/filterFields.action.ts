import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";
type UnknownObject = Record<string, unknown>;

const isSecretValue = (value: unknown): boolean => {
  if (typeof value !== "string") return false;

  return /^[A-Za-z0-9-_]{32,}$/.test(value);
};

const filterObject = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(filterObject);
  }

  const input = obj as UnknownObject;
  const result: UnknownObject = {};

  for (const key of Object.keys(input)) {
    const value = input[key];

    const lowerKey = key.toLowerCase();

    if (
      lowerKey.includes("password") ||
      lowerKey.includes("secret") ||
      lowerKey.includes("key")
    ) {
      continue;
    }

    if (isSecretValue(value)) {
      continue;
    }

    result[key] = filterObject(value);
  }

  return result;
};

export default class FilterFieldsAction<TIn, TOut> implements PipelineAction<
  TIn,
  TOut
> {
  async execute(payload: Payload<TIn>): Promise<Payload<TOut>> {
    const filteredData = filterObject(payload.data) as TOut;
    return { ...payload, data: filteredData };
  }
}
