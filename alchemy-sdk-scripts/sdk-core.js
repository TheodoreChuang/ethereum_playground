const SDK = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  // Replace with your Alchemy API Key.
  apiKey: process.env.ALCHEMY_MAINNET_KEY || "demo",
  // Replace with your network.
  network: SDK.Network.ETH_MAINNET,
};

const alchemy = new SDK.Alchemy(settings);

const queryAddress = "0x74E714dEa4a397686e57fF4Eb3761FA260c3D8eE";

/*//////////////////////////////////////////////////////////////
                               Core
//////////////////////////////////////////////////////////////*/

// Access standard Ethers.js JSON-RPC node request
alchemy.core.getBlockNumber().then(console.log);

// Access Alchemy Enhanced API requests
alchemy.core.getTokenBalances(queryAddress).then(console.log);
