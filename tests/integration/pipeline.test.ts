

import { createTestServer } from "../helpers/server";
import { createUserAndLogin } from "../helpers/auth";
import {
  createPipeline,
  updatePipeline,
  deletePipeline,
  listPipelines,
} from "../helpers/pipelines";
import { requestJson } from "../helpers/client";
const srv = createTestServer();
beforeAll(() => srv.start());
afterAll(() => srv.stop());
describe("Pipeline management", () => {
  it("creates a pipeline and returns ingest URL", async () => {
    const token = await createUserAndLogin(srv.baseUrl);
    const res = await createPipeline(srv.baseUrl, token);

    expect(res.status).toBe(201);
    expect(res.data?.data.id).toBeTruthy();
    expect(res.data?.data.ingestUrl).toContain("/webhooks/");
  });

  it("updates a pipeline name, action and subscribers", async () => {
    const token = await createUserAndLogin(srv.baseUrl);
    const created = await createPipeline(srv.baseUrl, token);

    const update = await updatePipeline(srv.baseUrl, token, created.data!.data.id, {
      name: "Updated Pipeline",
      description: "updated",
      actionType: "ADD_META",
      subscribers: ["https://example.com/hook", "https://example.com/extra"],
    });

    expect(update.status).toBe(200);
    expect(update.data?.data.name).toBe("Updated Pipeline");
    expect(update.data?.data.subscribers.length).toBe(2);
  });

  it("lists pipelines with pagination", async () => {
    const token = await createUserAndLogin(srv.baseUrl);
    await createPipeline(srv.baseUrl, token);

    const list = await listPipelines(srv.baseUrl, token);
    expect(list.status).toBe(200);
    expect(list.data?.data.items.length).toBe(1);
    expect(list.data?.data.total).toBe(1);
  });

  it("deletes a pipeline and returns 204", async () => {
    const token = await createUserAndLogin(srv.baseUrl);
    const created = await createPipeline(srv.baseUrl, token);
    console.log("pipeline===",created)
    expect(created.status).toBe(201);
    expect(created.data?.data.id).toBeTruthy();
    const del = await deletePipeline(srv.baseUrl, token, created.data!.data.id);
    expect(del.status).toBe(204);
  });

  it("returns 401 when creating a pipeline without auth token", async () => {
    const res = await requestJson<{ success: boolean }>(
      srv.baseUrl,
      "/api/pipelines",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "No Auth",
          actionType: "FORMAT_TEXT",
        }),
      },
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 when updating a non-existent pipeline", async () => {
    const token = await createUserAndLogin(srv.baseUrl);
    const res = await updatePipeline(
      srv.baseUrl,
      token,
      "00000000-0000-0000-0000-000000000000",
      { 
        name: "My Pipeline",
        description: "integration test",
        actionType: "FORMAT_TEXT",
        subscribers: ["https://example.com/hook"],

      },
    );
    expect(res.status).toBe(404);
  });
});