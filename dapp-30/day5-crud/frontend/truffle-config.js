const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider");

const secrets = JSON.parse(fs.readFileSync(".secrets").toString().trim());

module.exports = {
  networks: {
    // deployed @ https://ropsten.etherscan.io/address/0x2131e38bc0f47f6490d7e6fb70c519cc4c785baf
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          secrets.seed,
          `https://ropsten.infura.io/v3/${secrets.projectId}`
        ),
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
