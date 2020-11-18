const axios = require("axios");
const { config } = require("./config");
require("dotenv").config();

class SongPlayer {
  constructor(getByGenre, leaveVoice) {
    this.dispatcher = null;
    this.getSongForGenre = getByGenre;
    this.leaveVoice = leaveVoice;
    // console.log(config);
  }

  checkGuildExists = async (guild) => {
    try {
      var res = await axios.get(config.webserverUrl + "/guild", {
        params: { id: guild.id },
      });
      return res.data.length > 0 ? true : false;
    } catch (error) {
      console.log(error);
    }
  };

  addGuild = async (guild) => {
    try {
      await axios.post(
        config.webserverUrl + "/guild",
        {
          guild: guild,
        },
        { headers: { Authorization: `Bearer ${preocess.env.JWT_TOKEN}` } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  setCurrSong = (guild, song) => {
    try {
      axios.post(config.webserverUrl + "/guild", {
        guild: guild,
        song: song.name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  startSong = async (connection, song) => {
    // Checks if the guild is already in the database. If not, add it
    let exists = await this.checkGuildExists(connection.channel.guild);
    if (!exists) {
      console.log("Guild does not exist. Add it");
      await this.addGuild(connection.channel.guild);
    }

    this.setCurrSong(connection.channel.guild, song);

    console.log("attempting to play");
    console.log(song.url);

    this.dispatcher = connection.play(song.url, {
      highWaterMark: 50, // highWaterMark: used for
    });

    // TODO: improve stability and quality with opus
    this.dispatcher.on("start", () => {
      console.log(`${song.name} is now playing!`);
    });

    this.dispatcher.on("finish", async () => {
      console.log(`${song.name} has finished playing!`);
      if (connection.channel.members.size > 1) {
        let newSong = await this.getSongForGenre(song.genre, song.index);
        this.startSong(connection, newSong);
      } else {
        this.leaveVoice(connection);
        console.log("no more listeners. disconnecting...");
        connection.disconnect();
      }
    });

    // Always remember to handle errors appropriately!
    this.dispatcher.on("error", console.error);
  };

  pauseSong = () => {
    if (!this.dispatcher) {
      console.log("there is no dispatcher!");
    } else {
      this.dispatcher.pause();
    }
  };

  resumeSong = () => {
    if (!this.dispatcher) {
      throw "Error: no audio playing";
    }
    this.dispatcher.resume();
  };
}

module.exports = SongPlayer;
