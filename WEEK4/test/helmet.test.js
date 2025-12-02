import request from "supertest";
import loadApp from "../src/loaders/app.js";

let app;

beforeAll(async () => {
  app = await loadApp();
});

describe("Security: Helmet Headers", () => {
  test("should include common security headers", async () => {
    const res = await request(app).get("/product");

    expect(res.headers["x-dns-prefetch-control"]).toBeDefined();
    expect(res.headers["x-frame-options"]).toBeDefined();
    expect(res.headers["x-download-options"]).toBeDefined();
    expect(res.headers["x-content-type-options"]).toBeDefined();
    expect(res.headers["referrer-policy"]).toBeDefined();
  });
});