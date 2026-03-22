export type JsonResponse<T> = {
  status: number;
  data: T | null;
};

export async function requestJson<T>(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
): Promise<JsonResponse<T>> {
  const res = await fetch(`${baseUrl}${path}`, options);
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : null;
  return { status: res.status, data };
}