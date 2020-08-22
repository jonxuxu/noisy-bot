const startSong = (connection, file) => {
  // highWaterMark: used for
  const dispatcher = connection.play(file, { highWaterMark: 50 });

  // TODO: improve stability and quality with opus
  dispatcher.on("start", () => {
    console.log(`${file} is now playing!`);
  });

  dispatcher.on("finish", () => {
    console.log(`${file} has finished playing!`);
    connection.disconnect();
  });

  // Always remember to handle errors appropriately!
  dispatcher.on("error", console.error);
};

exports.startSong = startSong;
