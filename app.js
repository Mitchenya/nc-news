const express = require("express");
const topicsRouter = require("./routes/topics");
const app = express();

app.use("/api", topicsRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error" });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
