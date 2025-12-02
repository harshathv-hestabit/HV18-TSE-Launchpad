import request from "supertest";
import loadApp from "../src/loaders/app.js";

let app;
beforeAll(async () => {
  app = await loadApp();
});

describe("Security: Validation (Joi)", () => {
    test("should reject invalid Product payload", async () => {
        const badProduct = { price: -10 };
        const res = await request(app).post("/product").send(badProduct);

        expect(res.status).toBe(400);
    });
});
