const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/api.controller");
const { getArticleById } = require("./controllers/articles.controllers");
const {
  serverErrorHandler,
  customErrorHandler,
  idErrorHandler,
} = require("./error");

app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);
app.get("/api/articles/:article_id", getArticleById);
app.use(customErrorHandler);
app.use(idErrorHandler);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});
app.use(serverErrorHandler);

module.exports = app;
