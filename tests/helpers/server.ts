import { startApiServer, type StartedApi } from "../../src/main/api";

export function createTestServer() {
  let baseUrl = "";
  let started: StartedApi | null = null;

  return {
    get baseUrl() {
      return baseUrl;
    },
    async start() {
      started = await startApiServer({
        port: 0,
        connectRabbit: false,
        jobPublisher: { publishJob: async () => {} },
      });
      baseUrl = started.baseUrl;
    },
    async stop() {
      if (!started) return;
      await started.stop();
    },
  };
}
