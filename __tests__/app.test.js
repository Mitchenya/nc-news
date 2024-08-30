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
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
          });
          if (topic.description !== null) {
            expect(topic.description).toBeString();
          }
        });
      });
  });
});
describe("General error handling", () => {
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

describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("Responds with an array of articles containing all expected entries", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
      });
  });

  test("Each article should have the correct structure with necessary properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
});

test("Articles should not contain a 'body' property", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      articles.forEach((article) => {
        expect(article).not.toHaveProperty("body");
      });
    });
});

test("Each article should have a 'comment_count' property that accurately reflects the number of related comments", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      const comments = require("../db/data/test-data/comments");
      articles.forEach((article) => {
        const relatedComments = comments.filter(
          (comment) => comment.article_id === article.article_id
        );
        expect(Number(article.comment_count)).toBe(relatedComments.length); // Convert to number here
      });
    });
});

test("Articles should be sorted by 'created_at' in descending order", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      const sortedArticles = [...articles].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      expect(articles).toEqual(sortedArticles);
    });
});
