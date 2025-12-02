import request from "supertest";
import loadApp from "../src/loaders/app.js";

let app;

beforeAll(async () => {
  app = await loadApp();
});

describe("Security: Payload Size Limit", () => {
  test("should accept payload below limit", async () => {
    const smallPayload = { data: "x".repeat(1000) };
    const res = await request(app).post("/product").send(smallPayload);
    expect(res.status).toBeLessThan(500);
  });

  test("should block payload exceeding limit", async () => {
    const bigPayload = { data: "x".repeat(10 * 1024 * 1024) };
    const res = await request(app).post("/product").send(bigPayload);
    expect([413, 400]).toContain(res.status);
  });
});
