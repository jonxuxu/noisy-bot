const isProduction = process.env.NODE_ENV === "production";

var gameUrl;
if (isProduction) {
  gameUrl = "https://friendly-aryabhata-c57682.netlify.app";
} else {
  gameUrl = "http://localhost:3000";
}

var config = {
  gameUrl: gameUrl,
};

module.exports = { config };
