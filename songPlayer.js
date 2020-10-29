class songPlayer {
  constructor() {
    this.dispatcher = null;
  }

  getLink = (genre) => {
    var url = null;
    switch (genre) {
      case "chopin":
        url = "https://noisy-s3.s3.ca-central-1.amazonaws.com/out/Demo.oga";
        break;
    }
    return url;
  };

  startSong = (connection, genre) => {
    // highWaterMark: used for
    this.dispatcher = connection.play(this.getLink(genre), {
      highWaterMark: 50,
    });

    // TODO: improve stability and quality with opus
    this.dispatcher.on("start", () => {
      console.log(`${this.getLink(genre)} is now playing!`);
    });

    this.dispatcher.on("finish", () => {
      console.log(`${this.getLink(genre)} has finished playing!`);
      if (connection.channel.members.size > 1) {
        this.dispatcher = connection.play(this.getLink(genre), {
          highWaterMark: 50,
        });
      } else {
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

module.exports = new songPlayer();
