import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";

type UnknownObject = Record<string, unknown>;

const SECRET_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /access[_-]?token/i,
  /auth[_-]?token/i,
  /bearer/i,
  /credential/i,
  /passphrase/i,
];

const HIGH_CONFIDENCE_SECRET_VALUE_PATTERNS = [
  // JWT format
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
  // PEM-like
  /^-----BEGIN /,
];

const LOW_CONFIDENCE_SECRET_VALUE_PATTERNS = [
  // hex strings 32+ chars (hashes, keys)
  /^[a-f0-9]{32,}$/i,
  // base64url strings 32+ chars (tokens, keys)
  /^[A-Za-z0-9_-]{32,}$/,
];

const isDangerousKey = (key: string): boolean =>
  SECRET_KEY_PATTERNS.some((pattern) => pattern.test(key));

const isHighConfidenceSecretValue = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  return HIGH_CONFIDENCE_SECRET_VALUE_PATTERNS.some((pattern) =>
    pattern.test(value),
  );
};

const isLowConfidenceSecretValue = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  return LOW_CONFIDENCE_SECRET_VALUE_PATTERNS.some((pattern) =>
    pattern.test(value),
  );
};

const isPlainObject = (value: unknown): value is UnknownObject =>
  Object.prototype.toString.call(value) === "[object Object]";

const shouldRemoveValue = (key: string, value: unknown): boolean => {
  if (isDangerousKey(key)) return true;
  if (isHighConfidenceSecretValue(value)) return true;
  return isLowConfidenceSecretValue(value) && isDangerousKey(key);
};

const filterObject = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj
      .map(filterObject)
      .filter((item) => !isHighConfidenceSecretValue(item));
  }

  if (!isPlainObject(obj)) return obj;

  const result: UnknownObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (shouldRemoveValue(key, value)) continue;
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
    console.log("filtered");
    return { ...payload, data: filteredData };
  }
}
