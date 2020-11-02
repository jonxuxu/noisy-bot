const axios = require("axios");
const { config } = require("./config");

class SongPlayer {
  constructor(songSet) {
    this.dispatcher = null;
    this.songSetCall = songSet;
    this.currIndex = 0;
    console.log(config);
  }

  setCurrSong = (song) => {
    this.songSetCall(song);
    this.currIndex = song.index;
  };

  getSong = async (genre) => {
    try {
      var res = await axios.get(config.webserverUrl + "/currentSong", {
        params: { genre: genre, previous: this.currIndex },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  startSong = async (connection, genre) => {
    var song = await this.getSong(genre);
    this.setCurrSong(song);

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
        this.startSong(connection, genre);
      } else {
        console.log("no more listeners. disconnecting...");
        connection.disconnect();
      }
    });

    // Always remember to handle errors appropriately!
    this.dispatcher.on("error", console.error);
  };

  pauseSong = () => {
    if (!this.dispatcher) {
      throw "Error: no audio playing";
    }
    this.dispatcher.pause();
  };

  resumeSong = () => {
    if (!this.dispatcher) {
      throw "Error: no audio playing";
    }
    this.dispatcher.resume();
  };
}

module.exports = SongPlayer;
