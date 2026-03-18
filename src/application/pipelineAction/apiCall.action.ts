import { Payload } from "@core/dto/jobs/jobRequest.dto";
import PipelineAction from "@core/interfaces/actions/pipelineAction";

type Config = {
  url: string;
  method: string;
};

export default class ApiCallAction<TIn, TOut> implements PipelineAction<
  TIn,
  TOut
> {
  async execute(payload: Payload<TIn, Config>): Promise<Payload<TOut>> {
    const { config } = payload;

    if (!config) {
      throw new Error("Config not set");
    }

    const res = await fetch(config.url, {
      method: config.method ?? "POST",
      headers: { "content-type": "application/json" },
      body: config.method === "GET" ? undefined : JSON.stringify(payload.data),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`API call failed: ${res.status}`);
    }

    return {
      ...payload,
      data: JSON.parse(text),
    };
  }
}
