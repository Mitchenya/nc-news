const format = require("pg-format");
const db = require("./db/connection");

exports.checkValueExists = (table_name, column_name, value) => {
  const queryStr = format(
    "SELECT * FROM %I WHERE %I = $1;",
    table_name,
    column_name
  );
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: `${column_name} not found`,
      });
    }
  });
};
exports.checkColumnExists = (table_name, column_name) => {
  const queryStr = format("SELECT %I FROM %I;", column_name, table_name);
  return db.query(queryStr).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ message: "Bad request", status: 404 });
    }
  });
};
