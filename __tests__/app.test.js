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
const endpointsData = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("non-routed path", () => {
  test("should return a 404 error with 'Route not found' message for non-existent URLs", () => {
    return request(app)
      .get("/api/thisEndPointDoesNotExist")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 should return an array of all topics with required properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 should return an object with all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsData);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 should return the article with the specified id", () => {
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

  test("GET:200 should include a comment_count property reflecting the number of comments on the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
      });
  });

  test("GET:200 should set comment_count to 0 if there are no comments for the article", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(0);
      });
  });

  test("GET:404 should return an error message for a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });

  test("GET:400 should return an error message for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("PATCH:200 should update article votes by the amount specified in the inc_votes object", () => {
    const newVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(105);
      });
  });

  test("PATCH:200 should decrease article votes if inc_votes is negative", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(95);
      });
  });

  test("PATCH:404 should return an error message for a valid but non-existent article_id", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article_id not found");
      });
  });

  test("PATCH:400 should return an error message for an invalid article_id", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/destroyeverything")
      .send(newVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("PATCH:400 should return an error message if inc_votes contains an invalid value type", () => {
    const newVotes = { inc_votes: "macaronni" };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 should return an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
      });
  });

  test("GET:200 should include author, title, article_id, topic, created_at, votes, and article_img_url properties for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });

  test("GET:200 should not include a body property in any articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("GET:200 should include a comment_count property for each article, reflecting the number of comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
        });
      });
  });

  test("GET:200 should return articles sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("GET:200 should sort articles by the specified column (e.g., author) when provided in the query", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });

  test("GET:200 should sort articles by the specified column (e.g., votes) when provided in the query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });

  test("GET:400 should return an error message for invalid sort_by column names", () => {
    return request(app)
      .get("/api/articles?sort_by=passwords")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("GET:200 should sort the articles by the specified order (asc or desc) when provided in the query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });

  test("GET:200 should sort articles by the specified column and order when both sort_by and order queries are provided", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });

  test("GET:200 should use default sorting (by date in descending order) if sort_by or order queries are left blank", () => {
    return request(app)
      .get("/api/articles?sort_by=&order=")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("GET:400 should return an error message for invalid order query values (e.g., 12345)", () => {
    return request(app)
      .get("/api/articles?order=12345")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("GET:200 should filter articles by topic if a valid topic query is provided", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("GET:404 should return an error message if an invalid topic query is provided", () => {
    return request(app)
      .get("/api/articles?topic=11111")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("slug not found");
      });
  });

  test("GET:200 should return an empty array if a valid topic query is provided but there are no articles for that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET:200 should return an array of comments for the specified article_id with required properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toBe(1);
        });
      });
  });

  test("GET:200 should return comments sorted by creation date, with the most recent first ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at");
      });
  });

  test("GET:404 should return an error for a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article_id not found");
      });
  });

  test("GET:400 should return an error for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("GET:200 should return an empty array when a valid article_id has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("POST:201 should add a new comment and return it", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe(
          "I like this content, thank you for your hard work"
        );
      });
  });

  test("POST:201 should add a new comment with extra properties and return it", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
      givepassword: "${password}",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe(
          "I like this content, thank you for your hard work"
        );
        expect(comment.givepassword).not.toBe("${password}");
      });
  });

  test("POST:400 should return an error for a comment with missing body", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });

  test("POST:404 should return an error for a comment from a non-existent user", () => {
    const newComment = {
      username: "ImNoTrEaL",
      body: "not a real user",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Non existent user");
      });
  });

  test("POST:404 should return an error for a comment to a non-existent article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Non existent user");
      });
  });

  test("POST:400 should return an error for an invalid article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
    };
    return request(app)
      .post("/api/articles/NOT_A_USER_ID/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

test("DELETE:404 should return an error for a valid but non-existent comment_id", () => {
  return request(app)
    .delete("/api/comments/999")
    .expect(404)
    .then(({ body: { message } }) => {
      expect(message).toBe("comment_id not found");
    });
});

test("DELETE:400 should return an error for an invalid comment_id", () => {
  return request(app)
    .delete("/api/comments/not-an-id")
    .expect(400)
    .then(({ body: { message } }) => {
      expect(message).toBe("Bad request");
    });
});

describe("/api/users", () => {
  test("GET:200 should return an array of all users with their details", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
