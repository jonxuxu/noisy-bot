
class songPlayer  {

  constructor() {
    this.dispatcher = null
  }


  startSong = (connection, file) => {
    // highWaterMark: used for
    this.dispatcher = connection.play(file, { highWaterMark: 50 });
  
    // TODO: improve stability and quality with opus
    this.dispatcher.on("start", () => {
      console.log(`${file} is now playing!`);
    });
  
    this.dispatcher.on("finish", () => {
      console.log(`${file} has finished playing!`);
      connection.disconnect();
    });
  
    // Always remember to handle errors appropriately!
    this.dispatcher.on("error", console.error);
  };


    pauseSong = () => {

      if (!this.dispatcher) {
        throw "Error: no audio playing";
      }

      this.dispatcher.pause();

    }

    resumeSong = () => {
      if (!this.dispatcher) {
        throw "Error: no audio playing";
      }

      this.dispatcher.resume();
    }

}



module.exports = new songPlayer();
