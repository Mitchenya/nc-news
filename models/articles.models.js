const db = require("../db/connection");
const { checkValueExists, checkColumnExists } = require("../utils");
exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          message: "article does not exist",
          status: 404,
        });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by, order, topic) => {
  const queryProms = [];
  const queryVals = [];
  let queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

  if (topic) {
    queryProms.push(checkValueExists("topics", "slug", topic));
    queryVals.push(topic);
    queryStr += " WHERE topic = $1";
  }
  queryStr +=
    " GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url";

  if (sort_by) {
    queryProms.push(checkColumnExists("articles", sort_by));
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    queryStr += ` ORDER BY created_at`;
  }

  if (order) {
    if (!order === "asc" && !order === "desc") {
      return Promise.reject({ status: 400, message: "Bad request" });
    } else {
      order = order.toUpperCase();
      queryStr += ` ${order};`;
    }
  } else {
    queryStr += ` DESC;`;
  }
  queryProms.push(db.query(queryStr, queryVals));

  return Promise.all(queryProms).then((output) => {
    if (output[0] === undefined) {
      return output[1].rows;
    }
    return output[0].rows;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryProms = [];
  const queryStr =
    "UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *;";
  queryProms.push(db.query(queryStr, [inc_votes, article_id]));
  queryProms.push(checkValueExists("articles", "article_id", article_id));
  return Promise.all(queryProms).then((output) => {
    return output[0].rows[0];
  });
};
