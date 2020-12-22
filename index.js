require("dotenv").config();
const { config } = require("./config");

var Discord = require("discord.js");
var logger = require("winston");
const axios = require("axios");
var SongPlayer = require("./songPlayer");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

// Genre to string function
genreToString = (genre) => {
  switch (genre) {
    case "chopin":
      return "Chopin";
    case "mozart":
      return "Mozart";
    case "rachmaninoff":
      return "Rachmaninoff";
    case "ladygaga":
      return "Lady Gaga";
    case "country":
      return "Country";
    case "disney":
      return "Disney";
    case "jazz":
      return "Jazz";
    case "bach":
      return "Bach";
    case "beethoven":
      return "beethoven";
    case "journey":
      return "Journey";
    case "thebeatles":
      return "The Beatles";
    case "video":
      return "Video Game";
    case "broadway":
      return "Broadway";
    case "franksinatra":
      return "Frank Sinatra";
    case "bluegrass":
      return "Bluegrass";
    case "tchaikovsky":
      return "Tchaikovsky";
    case "christmas":
      return "Christmas";
  }
};

// Initialize Discord Bot
var bot = new Discord.Client();
bot.on("ready", () => {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");

  // Sets bot's status
  bot.user.setActivity("!help", { type: "LISTENING" });
});

// Embeds for message replies
const helpEmbed = (prefix) =>
  new Discord.MessageEmbed()
    .setColor("#ff00c1")
    .setTitle("Noisy Help")
    .setURL("https://noisy.live#commands")
    .addFields(
      { name: "**Commands**", value: "\u200B" },
      {
        name: `\`${prefix}play (optional song name or genre)\``,
        value: `Joins your current voice channel and start playing music. If Noisy is already playing, you can change the genre or song with this command.\n
        __supported genres:__ \`chopin\`,  \`mozart\`, \`rachmaninoff\`, \`ladygaga\`, \`country\`, \`disney\`, \`jazz\`, \`bach\`, \`beethoven\`, \`journey\`, \`thebeatles\`, \`video\`, \`broadway\`, \`franksinatra\`, \`bluegrass\`, \`tchaikovsky\`, \`christmas\``,
      },
      {
        name: `\`${prefix}join\``,
        value: "Prompts the bot to join your Discord voice channel.",
        inline: true,
      },
      {
        name: `\`${prefix}leave\``,
        value: "Leaves the voice channel it is in.",
        inline: true,
      },
      {
        name: `\`${prefix}pause\``,
        value: "Pauses the music, if anything is playing.",
        inline: true,
      },
      {
        name: `\`${prefix}resume\``,
        value: "Resumes the music, if it is paused.",
        inline: true,
      },
      {
        name: `\`${prefix}np\``,
        value: "Displays information about the currently playing song.",
        inline: true,
      },
      {
        name: `\`${prefix}prefix\``,
        value: `Customizes the command prefix. For example, \`${prefix}prefix ?\` will let you call Noisy with \`?\` instead of \`${prefix}\`, (i.e. \`?play chopin\`).`,
        inline: true,
      },
      {
        name: `\`${prefix}help\``,
        value:
          "Displays a basic help card if you're ever lost. By default, you can always call `!help` for the menu.",
        inline: true,
      },
      {
        name: "\u200B",
        value:
          ":question: New to Noisy? [Check us out!](https://noisy.live) \n\n :notepad_spiral: Still need help? You can [join our Discord server](https://discord.com/invite/dXtbw8CfMr)",
      }
    );
const currPlayEmbed = (song) =>
  new Discord.MessageEmbed()
    .setColor("#ff00c1")
    .setTitle(song.name)
    .setAuthor(
      "Now playing",
      "https://i.ibb.co/M7916b9/favicon.png",
      "https://noisy.live"
    )
    .setDescription(`In the theme of ${genreToString(song.genre)}`)
    .setThumbnail(
      `https://noisy-s3.s3.ca-central-1.amazonaws.com/assets/${song.genre}.png`
    );
{
}

// Play functions
var connection = null;
getSongForGenre = async (genre, index) => {
  try {
    var res = await axios.get(config.webserverUrl + "/currentSong", {
      params: { genre: genre, previous: index },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
const songPlayers = {};

// Get details of a song given the song name
getSpecificSong = async (name) => {
  try {
    var res = await axios.get(config.webserverUrl + "/getSong", {
      params: { songName: name },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Get details about the current guild
getGuild = async (guild) => {
  try {
    var res = await axios.get(config.webserverUrl + "/guild", {
      params: { id: guild.id },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Sets a new prefix for the guild
setPrefix = async (guild, prefix) => {
  try {
    var res = await axios.post(
      config.webserverUrl + "/guild",
      {
        guild: guild,
        prefix: prefix,
      },
      { headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` } }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Leave the voice channel function for the songPlayer
leaveVoice = (connection) => {
  delete songPlayers[connection.guild.id];
};

const supported = [
  "chopin",
  "mozart",
  "rachmaninoff",
  "ladygaga",
  "country",
  "disney",
  "jazz",
  "bach",
  "beethoven",
  "journey",
  "thebeatles",
  "video",
  "broadway",
  "franksinatra",
  "bluegrass",
  "tchaikovsky",
  "christmas",
];
const play = async (message, args = []) => {
  let guildId = message.guild.id;
  if (!(guildId in songPlayers)) {
    songPlayers[guildId] = new SongPlayer(getSongForGenre, leaveVoice);
  }

  if (args.length === 0) {
    // If no argument is supplied, play chopin music by default
    message.channel.send(
      ":notes: Generating and playing music in the style of `Chopin` by default"
    );
    let song = await getSongForGenre("chopin", 0);
    songPlayers[guildId].startSong(connection, song);
  } else {
    // If valid genre is supplied, play that
    if (supported.includes(args[0].toLocaleLowerCase())) {
      var genre = args[0].toLocaleLowerCase();
      message.channel.send(
        `:notes: Generating and playing music in the style of \`${genreToString(
          genre
        )}\``
      );
      var song = await getSongForGenre(genre, 0);
      songPlayers[guildId].startSong(connection, song);
    } else {
      var songs = await getSpecificSong(args[0]);
      if (songs.length > 0) {
        // If valid song is supplied, play that and continues with the new song's genre
        message.channel.send(`:notes: Playing ${songs[0].name}!`);
        songPlayers[guildId].startSong(connection, songs[0]);
      } else {
        // Not a valid song or genre
        message.channel.send(
          ":exclamation: Not a valid genre or song. You can find supported genres at https://noisy.live#commands"
        );
      }
    }
  }
};

// Process commands
bot.on("message", async (message) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (!message.content) {
    return;
  }
  var guild = await getGuild(message.guild);
  var prefix = guild.length > 0 ? guild[0].prefix : "!";

  if (message.content.substring(0, prefix.length) == prefix) {
    var args = message.content.substring(prefix.length).split(" ");
    var cmd = args[0];
    let guildId = message.guild.id;

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
            play(message, args);
          }
        } else {
          connection = await message.member.voice.channel.join();
          message.channel.send(
            `:thumbsup: Joined :sound:\`${connection.channel.name}\``
          );
          connection.voice.setSelfDeaf(true);
          if (cmd !== "join") {
            play(message, args);
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
        delete songPlayers[message.guild.id];
      } else {
        message.channel.send(
          `:x: I'm not connected to a voice channel. Type \`${prefix}join\` to get me in one`
        );
      }
    }
    // Pauses the currently playing song
    else if (cmd === "pause") {
      if (message.guild.me.voice.channel) {
        songPlayers[guildId].pauseSong();
        message.channel.send(
          `:pause_button: Player paused. Type \`${prefix}resume\` to resume`
        );
      } else {
        message.channel.send(
          `:x: I'm not connected to a voice channel. Type \`${prefix}join\` to get me in one`
        );
      }
    }
    // Resumes the currently paused song
    else if (cmd === "resume") {
      if (message.guild.me.voice.channel) {
        songPlayers[guildId].resumeSong();
        message.channel.send(":play_pause: Resuming player");
      } else {
        message.channel.send(
          `:x: I'm not connected to a voice channel. Type \`${prefix}join\` to get me in one`
        );
      }
    }
    // Now playing
    else if (cmd === "np") {
      if (message.guild.me.voice.channel) {
        var currSong = guild[0].song;
        if (currSong == undefined) {
          message.channel.send(
            ":x: You haven't played any songs on this server yet"
          );
        } else {
          var songs = await getSpecificSong(currSong);
          message.channel.send(currPlayEmbed(songs[0]));
        }
      } else {
        message.channel.send(
          `:x: I'm not connected to a voice channel. Type \`${prefix}join\` to get me in one`
        );
      }
    }
    // Update the command prefix
    else if (cmd === "prefix") {
      if (args.length > 1) {
        return message.channel.send(":x: Set a prefix without spaces");
      }
      if (args.length == 0) {
        return message.channel.send(":x: No prefix argument supplied");
      }
      var newPrefix = args[0];
      setPrefix(message.guild, newPrefix);
      return message.channel.send(
        `:thumbsup: The command prefix is now set to \`${newPrefix}\``
      );
    }
    // Displays a help message
    else if (cmd === "help") {
      message.channel.send(helpEmbed(prefix));
    }
  }
  // Support the !help command regardless of server prefix
  else if (message.content.substring(0, 1) == "!") {
    var args = message.content.substring(1).split(" ");
    var cmd = args[0];
    if (cmd === "help") {
      message.channel.send(helpEmbed(prefix));
    }
  }
});

bot.login(process.env.DISCORD_TOKEN);
