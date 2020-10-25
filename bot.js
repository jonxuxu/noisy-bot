var Discord = require("discord.js");
var logger = require("winston");
var auth = require("./auth.json");
var songPlayer = require("./songPlayer");
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client();
bot.on("ready", () => {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

// Embeds for message replies
const helpEmbed = new Discord.MessageEmbed()
  .setColor("#ff00c1")
  .setTitle("Noisy Help")
  .setURL("https://noisy.live")
  .setDescription(
    ":checkered_flag: Click [here](https://noisy.live#commands) for a list of commands \n :question: New to Noisy? [Check us out!](https://noisy.live)"
  );
const currPlayEmbed = (genre, requester) =>
  new Discord.MessageEmbed()
    .setColor("#ff00c1")
    .setTitle(genre)
    .setAuthor(
      "Now playing",
      "https://i.ibb.co/M7916b9/favicon.png",
      "https://noisy.live"
    )
    .setDescription(`Requested by ${requester}`)
    .setThumbnail("https://i.imgur.com/wSTFkRM.png");

// Play functions
var connection = null;
var currGenre = "pop";
const play = (channel, args = []) => {
  if (args.length === 0) {
    channel.send(":notes: Generating and playing live `pop` music by default");
    songPlayer.startSong(
      connection,
      "https://noisy-s3.s3.ca-central-1.amazonaws.com/out/Soulful.ogg"
    );
  } else {
    currGenre = args[0];
    channel.send(
      `:notes: Generating and playing live \`${currGenre}\` music by default`
    );
  }
};

bot.on("message", async (message) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`

  if (!message.content) {
    return;
  }

  if (message.content.substring(0, 1) == "!") {
    var args = message.content.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);
    // !ping
    if (cmd === "ping") {
      message.channel.send("pong!");
    }
    // Joins voice channel
    else if (cmd === "join" || cmd === "play") {
      if (message.member.voice.channel) {
        if (message.guild.me.voice.channel) {
          if (cmd === "join") {
            message.reply(
              `I'm already connected to :sound:\`${message.guild.me.voice.channel.name}\``
            );
          } else {
            play(message.channel, args);
          }
        } else {
          connection = await message.member.voice.channel.join();
          message.channel.send(
            `:thumbsup: Joined :sound:\`${message.guild.me.voice.channel.name}\``
          );
          if (cmd !== "join") {
            play(message.channel, args);
          }
        }
      } else {
        message.channel.send(":exclamation: You must be in a voice channel!");
      }
    }
    // Leave the voice channel
    else if (cmd === "leave") {
      if (message.guild.me.voice.channel) {
        message.guild.me.voice.channel.leave();
        message.channel.send(":leaves: Successfully Disconnected");
      } else {
        message.channel.send(
          ":x: I'm not connected to a voice channel. Type `!join` to get me in one"
        );
      }
    }
    // Pauses the currently playing song
    else if (cmd === "pause") {
      if (message.guild.me.voice.channel) {
        songPlayer.pauseSong();
        message.channel.send(":pause_button: Paused");
      } else {
        message.channel.send(
          ":x: I'm not connected to a voice channel. Type `!join` to get me in one"
        );
      }
    }
    // Resumes the currently paused song
    else if (cmd === "resume") {
      if (message.guild.me.voice.channel) {
        songPlayer.resumeSong();
        message.channel.send(":play_pause: Resuming");
      } else {
        message.channel.send(
          ":x: I'm not connected to a voice channel. Type `!join` to get me in one"
        );
      }
    }
    // Now playing
    else if (cmd === "np") {
      if (message.guild.me.voice.channel) {
        message.channel.send(currPlayEmbed(currGenre, "person"));
      } else {
        message.channel.send(
          ":x: I'm not connected to a voice channel. Type `!join` to get me in one"
        );
      }
    }
    // Displays a help message
    else if (cmd === "help") {
      message.channel.send(helpEmbed);
    }
  }
});

bot.login(auth.token);
