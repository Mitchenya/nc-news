const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  serverErrorHandler,
  customErrorHandler,
  idErrorHandler,
} = require("./error");

app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.use(customErrorHandler);
app.use(idErrorHandler);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});
app.use(serverErrorHandler);

module.exports = app;
