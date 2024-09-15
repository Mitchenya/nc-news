exports.customErrorHandler = (err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};
exports.idErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};
exports.reqBodyErrorHandler = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};
exports.userErrorHandler = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "Non existent user" });
  } else {
    next(err);
  }
};
exports.queryInputErrorHandler = (err, req, res, next) => {
  if (err.code === "42703" || err.code === "42601") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};
exports.serverErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "internal server error" });
};
