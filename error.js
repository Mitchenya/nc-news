exports.customErrorHandler = (err, req, res, next) => {
  console.log(err, "<-- err");
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

exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
};
