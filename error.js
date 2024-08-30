exports.serverErrorHandler = (err, req, res, next) => {
  response.status(500).send({ message: "internal server error" });
};
