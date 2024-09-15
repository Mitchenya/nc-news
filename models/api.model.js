const fs = require("fs/promises");

exports.showAllEndpoints = () => {
  return fs.readFile("endpoints.json", "utf8").then((endpointData) => {
    try {
      return JSON.parse(endpointData);
    } catch (err) {
      throw {
        status: 500,
        message: "Failed to parse endpoints.json",
      };
    }
  });
};
