import ActionType from "@core/enum/actionType.enum";
import type { ActionConfig } from "@core/models/pipeline.model";

export async function runAction(
  actionType: ActionType,
  actionConfig: ActionConfig,
  payload: unknown,
): Promise<unknown> {
  switch (actionType) {
    case ActionType.UPPERCASE:
      return uppercase(payload);
    case ActionType.ADD_TIMESTAMP:
      return addTimestamp(payload);
    case ActionType.MAKE_API_CALL:
      return makeApiCall(actionConfig, payload);
    default:
      return payload;
  }
}

function uppercase(payload: unknown): unknown {
  if (typeof payload === "string") return payload.toUpperCase();
  if (payload && typeof payload === "object" && "text" in payload) {
    const value = (payload as { text?: unknown }).text;
    if (typeof value === "string") {
      return {
        ...(payload as Record<string, unknown>),
        text: value.toUpperCase(),
      };
    }
  }
  return payload;
}

function addTimestamp(payload: unknown): unknown {
  const timestamp = new Date().toISOString();
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return { ...(payload as Record<string, unknown>), timestamp };
  }
  return { payload, timestamp };
}

async function makeApiCall(
  actionConfig: ActionConfig,
  payload: unknown,
): Promise<unknown> {
  const url = actionConfig.url;
  if (typeof url !== "string" || !url) {
    throw new Error("MAKE_API_CALL requires actionConfig.url");
  }
  const method =
    typeof actionConfig.method === "string" ? actionConfig.method : "POST";

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  const extraHeaders = actionConfig.headers;
  if (extraHeaders && typeof extraHeaders === "object") {
    for (const [k, v] of Object.entries(
      extraHeaders as Record<string, unknown>,
    )) {
      if (typeof v === "string") headers[k] = v;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();
  const body =
    contentType.includes("application/json") && text ? safeJsonParse(text) : text;

  if (!res.ok) {
    throw new Error(
      `MAKE_API_CALL failed: ${res.status} ${res.statusText} - ${truncate(
        typeof body === "string" ? body : JSON.stringify(body),
      )}`,
    );
  }
  return body;
}

function safeJsonParse(text: string): string {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function truncate(s: string, max = 500): string {
  return s.length <= max ? s : `${s.slice(0, max)}...`;
}

