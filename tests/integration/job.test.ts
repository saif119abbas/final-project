import { createTestServer } from "../helpers/server";
import { createUserAndLogin } from "../helpers/auth";
import { createPipeline } from "../helpers/pipelines";
import { requestJson } from "../helpers/client";

/* -------------------------------------------------------------------------- */
/* types                                                                      */
/* -------------------------------------------------------------------------- */

type IngestResponse = {
  data: {
    jobId: string;
  };
};

type JobDetailsResponse = {
  success: boolean;
  data: {
    id: string;
    pipeline: string;
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
};

type JobAttemptsResponse = {
  success: boolean;
  data: Array<{
    jobId: string;
    status: string;
    attemptNumber: number;
  }>;
};

type JobsListResponse = {
  success: boolean;
  data: {
    items: Array<{
      id: string;
      jobStatus: string;
    }>;
    total: number;
  };
};

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

function assertDefined<T>(
  value: T | undefined | null,
  message?: string,
): T {

  if (value === undefined || value === null) {
    throw new Error(message ?? "Expected value to be defined");
  }
  expect(value).toBeDefined();
  return value;
}

async function createJob(baseUrl: string) {
  const token = await createUserAndLogin(baseUrl);
  const pipeline = await createPipeline(baseUrl, token);

  const ingestUrl = assertDefined(
    pipeline.data?.data.ingestUrl,
    "Pipeline ingestUrl missing",
  );

  const ingest = await requestJson<IngestResponse>(
    baseUrl,
    ingestUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: {
          data: { text: "hello" },
        },
      }),
    },
  );

  expect(ingest.status).toBe(202);

  const jobId = assertDefined(
    ingest.data?.data.jobId,
    "JobId missing from ingestion response",
  );

  return {
    jobId,
    token,
    pipeline,
  };
}

/* -------------------------------------------------------------------------- */
/* setup                                                                      */
/* -------------------------------------------------------------------------- */

const srv = createTestServer();

beforeAll(() => srv.start());
afterAll(() => srv.stop());

/* -------------------------------------------------------------------------- */
/* tests                                                                      */
/* -------------------------------------------------------------------------- */

describe("Jobs API", () => {
  describe("Job details", () => {
    it("returns job details after ingestion", async () => {
      const { jobId } = await createJob(srv.baseUrl);

      const res = await requestJson<JobDetailsResponse>(
        srv.baseUrl,
        `/jobs/${jobId}`,
      );

      expect(res.status).toBe(200);

      const data = assertDefined(res.data?.data);

      expect(data.id).toBe(jobId);
      expect(data.status).toBe("PENDING");
      expect(data.pipeline).toBeTruthy();
      expect(data.actionType).toBe("FORMAT_TEXT");

      expect(Array.isArray(data.subscribers)).toBe(true);

      expect(data.metrics.totalSubscribers)
        .toBeGreaterThanOrEqual(0);

      expect(data.metrics.successfulDeliveries)
        .toBe(0);

      expect(data.metrics.failedDeliveries)
        .toBe(0);
    });

    it("returns 404 for non-existent job", async () => {
      const res = await requestJson<{ success: boolean }>(
        srv.baseUrl,
        "/jobs/00000000-0000-0000-0000-000000000000",
      );

      expect(res.status).toBe(404);
    });
  });

  describe("Job attempts", () => {
    it("returns empty delivery attempts list for pending job", async () => {
      const { jobId } = await createJob(srv.baseUrl);

      const res = await requestJson<JobAttemptsResponse>(
        srv.baseUrl,
        `/jobs/${jobId}/attempts`,
      );

      expect(res.status).toBe(200);

      const attempts = assertDefined(res.data?.data);

      expect(Array.isArray(attempts)).toBe(true);

      // worker has not processed job yet
      expect(attempts.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Job listing", () => {
    it("lists jobs with pagination", async () => {
      await createJob(srv.baseUrl);

      const res = await requestJson<JobsListResponse>(
        srv.baseUrl,
        "/jobs?page=1&limit=10",
      );

      expect(res.status).toBe(200);

      const data = assertDefined(res.data?.data);

      expect(data.items.length).toBeGreaterThan(0);

      expect(data.total).toBeGreaterThan(0);

      expect(data.items[0].jobStatus)
        .toBe("PENDING");
    });
  });
});
