const fs = require("fs/promises");
exports.showAllEndpoints = () => {
  return fs.readFile("endpoints.json", "utf8").then((endpointData) => {
    return JSON.parse(endpointData);
  });
};
