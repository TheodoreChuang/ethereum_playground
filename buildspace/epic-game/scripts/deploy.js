const main = async () => {
  /*
   * Deployment
   */
  const EpicGame = await hre.ethers.getContractFactory("EpicGame");
  const epicGame = await EpicGame.deploy(
    // Characters
    ["Sorceress", "Amazon", "Barbarian"], // Names
    [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdiablo.gamepedia.com%2Fmedia%2Fdiablo.gamepedia.com%2Ff%2Ff2%2FSorceress.gif%3Fversion%3D2c413e047ddf9c8b9871a97379648e9e&f=1&nofb=1", // Images
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fdiablo%2Fimages%2F9%2F9c%2FAmazon.gif%2Frevision%2Flatest%3Fcb%3D20090510125020&f=1&nofb=1",
      "https://static.wikia.nocookie.net/diablo/images/a/a7/Barbarian_diablo_II.gif/revision/latest/scale-to-width-down/97?cb=20110509052423",
    ],
    [100, 200, 300], // HP
    [100, 50, 25], // Attack
    // Big Boss
    "Diablo", // Name
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdiablo.gamepedia.com%2Fmedia%2Fdiablo.gamepedia.com%2F7%2F72%2FDiablo_%2528Diablo_I%2529.gif%3Fversion%3D4537ef80639d2de636ae4039558bf6ee&f=1&nofb=1", // Image
    9000, // HP
    50 // Attack
  );
  await epicGame.deployed();
  console.log("EpicGame contract deployed to: ", epicGame.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
