const express = require("express");
const app = express();
const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
  patchArticleVotes,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteCommentByCommentId,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controller");
const {
  serverErrorHandler,
  customErrorHandler,
  idErrorHandler,
  reqBodyErrorHandler,
  userErrorHandler,
  queryInputErrorHandler,
} = require("./error");

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api", getEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);
app.get("/api/users", getUsers);

app.use(customErrorHandler);
app.use(idErrorHandler);
app.use(reqBodyErrorHandler);
app.use(userErrorHandler);
app.use(queryInputErrorHandler);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(serverErrorHandler);

module.exports = app;
