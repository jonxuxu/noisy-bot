require("dotenv").config({ path: "../.env" });
const { config } = require("./config");

process.env["NTBA_FIX_319"] = 1; // as per https://github.com/yagop/node-telegram-bot-api/issues/484

var winston = require("winston");
const TelegramBot = require("node-telegram-bot-api");

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "telegram" },
  transports: [new winston.transports.Console()],
});

logger.info("Bot starting");

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;
console.log(token);
const gameName = "http://t.me/N0isyBot?game=player";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

logger.info("Bot started and listening");

// Matches "/play [whatever]"
bot.onText(/\/play (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const args = match[1].split(" ");
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  //   bot.sendMessage(chatId, resp);
  bot.sendGame(chatId, "player");
});

// Handle callback queries
bot.on("callback_query", function (query) {
  if (query.game_short_name !== "player") {
    bot.answerCallbackQuery(
      query.id,
      "Sorry, '" + query.game_short_name + "' is not a supported game."
    );
  } else {
    // let gameUrl = `https://noisy.live?telegram=true"`;
    let gameUrl = "https://noisy.live/player";
    bot.answerCallbackQuery({ callback_query_id: query.id, url: gameUrl });
  }
});
