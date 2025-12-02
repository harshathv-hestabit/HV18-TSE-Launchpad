import request from "supertest";
import loadApp from "../src/loaders/app.js";
import { limiter } from "../src/middlewares/security.middleware.js";

let app;

beforeAll(async () => {
  app = await loadApp();
});

beforeEach(() => {
  limiter.store?.resetAll?.();
});

describe("Security: Rate Limiting", () => {
  test("should allow requests below rate limit", async () => {
    const res = await request(app).get("/product");
    expect(res.status).toBe(200);
  });

  test("should block when exceeding rate limit", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).get("/product");
    }

    const res = await request(app).get("/product");
    expect([429, 403]).toContain(res.status);
  });
});
