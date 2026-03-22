// tests/integration/helpers/auth.ts
import { requestJson } from "./client";
function uniqueEmail() {
  return `user_${Math.random().toString(36).slice(2, 8)}@example.com`;
}

function uniqueUsername() {
  return `user_${Math.random().toString(36).slice(2, 8)}`;
}

export async function registerUser(
  baseUrl: string,
  overrides: Partial<{
    email: string;
    password: string;
    username: string;
  }> = {},
) {
  return requestJson<{
    success: boolean;
    data: { id: string; email: string; username: string };
  }>(baseUrl, "/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: uniqueEmail(),
      password: "Password123",
      username: uniqueUsername(),
      ...overrides,
    }),
  });
}

export async function loginUser(
  baseUrl: string,
  email: string,
  password: string,
) {
  return requestJson<{
    success: boolean;
    data: { accessToken: string; user: { id: string } };
  }>(baseUrl, "/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function createUserAndLogin(baseUrl: string): Promise<string> {
  const email = uniqueEmail();
  const username = uniqueUsername();
  const password = "Password123";

await registerUser(baseUrl, { email, username, password });
  const login = await loginUser(baseUrl, email, password);
  return login.data!.data.accessToken;
}