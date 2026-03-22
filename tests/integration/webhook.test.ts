import { createTestServer } from "../helpers/server";
import { createUserAndLogin } from "../helpers/auth";
import { createPipeline } from "../helpers/pipelines";
import { requestJson } from "../helpers/client";

const srv = createTestServer();
beforeAll(() => srv.start());
afterAll(() => srv.stop());

// ── Webhook Ingestion ──────────────────────────────────────────────────────────
describe("Webhook ingestion", () => {
  it("accepts a webhook POST and returns 202 with a jobId", async () => {
    const token = await createUserAndLogin(srv.baseUrl);
    const pipeline = await createPipeline(srv.baseUrl, token);

    const ingest = await requestJson<{ data: { jobId: string } }>(
      srv.baseUrl,
      pipeline.data!.data.ingestUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: { data: { text: "hello" } } }),
      },
    );

    expect(ingest.status).toBe(202);
    expect(ingest.data?.data.jobId).toBeTruthy();
  });

  it("returns 404 for an unknown source path", async () => {
    const res = await requestJson<{ success: boolean }>(
      srv.baseUrl,
      "/webhooks/does_not_exist",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: { data: { text: "hello" } } }),
      },
    );
    expect(res.status).toBe(404);
  });
});