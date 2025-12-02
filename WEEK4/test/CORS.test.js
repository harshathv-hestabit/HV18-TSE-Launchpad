import request from "supertest";
import loadApp from "../src/loaders/app.js";

let app;

beforeAll(async () => {
  app = await loadApp();
});

describe("Security: CORS Policy", () => {
  const allowedOrigin = "http://localhost:3001";
  const blockedOrigin = "http://localhost:9999";

  test("should allow requests from allowed origin", async () => {
    const res = await request(app)
      .get("/test")
      .set("Origin", allowedOrigin);

    expect(res.headers["access-control-allow-origin"]).toBe(allowedOrigin);
  });

  test("should block requests from disallowed origin", async () => {
    const res = await request(app)
      .get("/test")
      .set("Origin", blockedOrigin);

    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
