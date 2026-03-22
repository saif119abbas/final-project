import { requestJson } from "./client";

export type PipelineData = {
  id: string;
  ingestUrl: string;
  sourcePath: string;
};

export async function createPipeline(
  baseUrl: string,
  token: string,
  overrides: Partial<{
    name: string;
    description: string;
    actionType: string;
    subscribers: string[];
  }> = {},
) {
  return requestJson<{
    success: boolean;
    data: PipelineData;
  }>(baseUrl, "/api/pipelines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "My Pipeline",
      description: "integration test",
      actionType: "FORMAT_TEXT",
      subscribers: ["https://example.com/hook"],
      ...overrides,
    }),
  });
}

export async function updatePipeline(
  baseUrl: string,
  token: string,
  id: string,
  body: object,
) {
  return requestJson<{
    success: boolean;
    data: { id: string; name: string; subscribers: string[] };
  }>(baseUrl, `/api/pipelines/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function deletePipeline(
  baseUrl: string,
  token: string,
  id: string,
) {
  return requestJson<unknown>(baseUrl, `/api/pipelines/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listPipelines(
  baseUrl: string,
  token: string,
  query = "page=1&limit=10",
) {
  return requestJson<{
    success: boolean;
    data: { items: Array<{ id: string }>; total: number };
  }>(baseUrl, `/api/pipelines?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}