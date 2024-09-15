const db = require("../db/connection");
const { checkValueExists } = require("../utils");

exports.selectCommentsByArticleId = (article_id) => {
  const queryVals = [article_id];
  const queryProms = [];
  let queryStr =
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE comments.article_id = $1 ORDER BY created_at";

  queryProms.push(db.query(queryStr, queryVals));
  queryProms.push(checkValueExists("articles", "article_id", article_id));
  return Promise.all(queryProms).then((output) => {
    return output[0].rows;
  });
};
exports.insertComment = (article_id, { username, body }) => {
  const queryProms = [];
  let queryStr =
    "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;";
  queryProms.push(db.query(queryStr, [body, username, article_id]));
  queryProms.push(checkValueExists("articles", "article_id", article_id));
  return Promise.all(queryProms).then((output) => {
    return output[0].rows[0];
  });
};
exports.removeCommentByCommentId = (comment_id) => {
  const queryProms = [];
  let queryStr = "DELETE FROM comments WHERE comment_id = $1 RETURNING *;";
  queryProms.push(checkValueExists("comments", "comment_id", comment_id));
  queryProms.push(db.query(queryStr, [comment_id]));
  return Promise.all(queryProms);
};
