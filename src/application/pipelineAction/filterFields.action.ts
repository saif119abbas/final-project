import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";

type UnknownObject = Record<string, unknown>;

const isSecretValue = (value: unknown): boolean => {
  if (typeof value !== "string") return false;

  return /^[A-Za-z0-9-_]{32,}$/.test(value);
};

const isDangerousKey = (key: string): boolean => {
  const lowerKey = key.toLowerCase();

  return (
    lowerKey.includes("password") ||
    lowerKey.includes("secret") ||
    lowerKey.includes("key") ||
    key === "__proto__" ||
    key === "constructor" ||
    key === "prototype"
  );
};

const filterObject = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(filterObject);
  }

  const result: UnknownObject = Object.create(null);

  for (const [key, value] of Object.entries(obj as UnknownObject)) {
    if (isDangerousKey(key)) continue;

    if (isSecretValue(value)) continue;

    // safe: key validated + Object.create(null) prevents prototype pollution
    // eslint-disable-next-line security/detect-object-injection
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

    return {
      ...payload,
      data: filteredData,
    };
  }
}
