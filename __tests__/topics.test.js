const request = require("supertest");
const app = require("../app");

describe("GET /api/topics", () => {
  test("should respond with a 200 status code and an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("topics");
        expect(response.body.topics.length).toBeGreaterThan(0);
        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("should respond with a 404 status code for an unknown endpoint", () => {
    return request(app)
      .get("/api/unknown")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Not Found" });
      });
  });
});
