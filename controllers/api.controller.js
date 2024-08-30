const { showAllEndpoints } = require("../models/api.model");
exports.getEndPoints = (req, res) => {
  showAllEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
