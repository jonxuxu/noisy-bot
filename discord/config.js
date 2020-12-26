const isProduction = process.env.NODE_ENV === "production";

var webserverUrl;
if (isProduction) {
  webserverUrl = "https://noisy-webserver.herokuapp.com";
} else {
  webserverUrl = "http://localhost:3003";
}

var config = {
  webserverUrl: webserverUrl,
};

module.exports = { config };
