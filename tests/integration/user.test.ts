import { createTestServer } from "../helpers/server";
import { registerUser, loginUser } from "../helpers/auth";

const srv = createTestServer();
beforeAll(() => srv.start());
afterAll(() => srv.stop());

describe("User registration and authentication", () => {
  it("registers a new user and returns 201", async () => {
    const res = await registerUser(srv.baseUrl,  {
      email:"user@example.com",
      password:"Password123"
    });
    expect(res.status).toBe(201);
    expect(res.data?.data.email).toBe("user@example.com",);
  });

  it("logs in with valid credentials and returns an access token", async () => {
    await registerUser(srv.baseUrl,
    {
      email:"user@example.com",
      password:"Password123"
    });
    const login = await loginUser(srv.baseUrl, "user@example.com", "Password123");
    expect(login.status).toBe(200);
    expect(login.data?.data.accessToken).toBeTruthy();
    expect(login.data?.data.accessToken.length).toBeGreaterThan(10);
  });

  it("rejects registration with invalid email format", async () => {
    const res = await registerUser(srv.baseUrl, {
      email: "not-an-email",
      username: "ab",
      password: "short",
    });
    expect(res.status).toBe(400);
  });

  it("rejects login with wrong password", async () => {
    await registerUser(srv.baseUrl);
    const res = await loginUser(srv.baseUrl, "user@example.com", "WrongPassword");
    expect(res.status).toBe(401);
  });
});