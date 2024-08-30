const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("200: response array should contain all of the data from topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach(({ description, slug }) => {
          expect(typeof description).toBe("string");
          expect(typeof slug).toBe("string");
        });
      });
  });
  test("if a non-existent url has been input, return the error message of Route not found", () => {
    return request(app)
      .get("/api/thisEndPointDoesNotExist")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});

describe("/api", () => {
  test("200: return api endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api");
        expect(endpoints).toHaveProperty("GET /api/topics");
      });
  });
});
