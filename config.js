const isProduction = process.env.NODE_ENV === "production";

var config;
if (isProduction) {
  config = {
    webserverUrl: "https://noisy-webserver.herokuapp.com",
  };
} else {
  config = {
    webserverUrl: "http://localhost:3003",
  };
}

module.exports = { config };
