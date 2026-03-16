import PipelineAction from "@core/interfaces/actions/pipelineAction";
import type { ActionConfig } from "@core/models/pipeline.model";

export default class ApiCallAction implements PipelineAction {

  async execute(payload: unknown, config: ActionConfig): Promise<unknown> {

    const url = config.url;

    if (typeof url !== "string" || !url) {
      throw new Error("MAKE_API_CALL requires actionConfig.url");
    }

    const method =
      typeof config.method === "string"
        ? config.method
        : "POST";

    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: method === "GET" ? undefined : JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`API call failed: ${res.status}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
}
