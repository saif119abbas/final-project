import type { AddressInfo } from "net";
import type { Server } from "http";
import createApp from "../../src/main/app";

export function createTestServer() {
  const app = createApp({
    jobPublisher: { publishJob: async () => {} },
  });

  let baseUrl = "";
  let server: Server;

  return {
    get baseUrl() {
      return baseUrl;
    },
    async start() {
      await new Promise<void>((resolve) => {
        server = app.listen(0, () => resolve()); // ← wait for listen to complete
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
      });
    },
    async stop() {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    },
  };
}