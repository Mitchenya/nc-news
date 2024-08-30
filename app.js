const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { serverErrorHandler } = require("./error");
const { getEndPoints } = require("./controllers/api.controller");

app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});
app.use(serverErrorHandler);

module.exports = app;
