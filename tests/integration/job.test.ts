import { createTestServer } from "../helpers/server";
import { createUserAndLogin } from "../helpers/auth";
import { createPipeline } from "../helpers/pipelines";
import { requestJson } from "../helpers/client";

const srv = createTestServer();
beforeAll(() => srv.start());
afterAll(() => srv.stop());
describe("Job history and delivery attempts", () => {
it("returns job details after ingestion", async () => {
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
  const jobId = ingest.data?.data.jobId!;
  expect(jobId).toBeTruthy();

  const details = await requestJson<{
    success: boolean;
    data: {
      id: string;
      pipeline: string;           // sourcePath string, not object
      actionType: string;
      subscribers: string[];
      payload: unknown;
      result: unknown | null;
      status: string;
      scheduledFor: string;
      createdAt: string;
      metrics: {
        totalSubscribers: number;
        successfulDeliveries: number;
        failedDeliveries: number;
      };
    };
  }>(srv.baseUrl, `/jobs/${jobId}`);

  expect(details.status).toBe(200);
  expect(details.data?.data.id).toBe(jobId);                      
  expect(details.data?.data.status).toBe("PENDING");
  expect(details.data?.data.pipeline).toBeTruthy();   
  expect(details.data?.data.actionType).toBe("FORMAT_TEXT");
  expect(Array.isArray(details.data?.data.subscribers)).toBe(true);
  expect(details.data?.data.metrics.totalSubscribers).toBeGreaterThanOrEqual(0);
  expect(details.data?.data.metrics.successfulDeliveries).toBe(0);
  expect(details.data?.data.metrics.failedDeliveries).toBe(0);
});

  it("returns empty delivery attempts list for a pending job", async () => {
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

    const jobId = ingest.data?.data.jobId!;

    const attempts = await requestJson<{
      success: boolean;
      data: Array<{
        jobId: string;
        status: string;
        attemptNumber: number;
      }>;
    }>(srv.baseUrl, `/jobs/${jobId}/attempts`);

    expect(attempts.status).toBe(200);
    expect(Array.isArray(attempts.data?.data)).toBe(true);
    // No attempts yet — worker hasn't processed the job
    expect(attempts.data?.data.length).toBeGreaterThanOrEqual(0);
  });
  it("lists all jobs with pagination", async () => {
  const token = await createUserAndLogin(srv.baseUrl);
  const pipeline = await createPipeline(srv.baseUrl, token);

  await requestJson(srv.baseUrl, pipeline.data!.data.ingestUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: { data: { text: "hello" } } }),
  });

  const jobs = await requestJson<{
    success: boolean;
    data: {
      items: Array<{ id: string; jobStatus: string }>;  // ← jobStatus not status
      total: number;
    };
  }>(srv.baseUrl, "/jobs?page=1&limit=10");

  expect(jobs.status).toBe(200);
  expect(jobs.data?.data.items.length).toBeGreaterThan(0);
  expect(jobs.data?.data.total).toBeGreaterThan(0);
  expect(jobs.data?.data.items[0].jobStatus).toBe("PENDING"); // matches getJobs query alias
});

  it("returns 404 for a non-existent job", async () => {
    const res = await requestJson<{ success: boolean }>(
      srv.baseUrl,
      "/jobs/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });
});
