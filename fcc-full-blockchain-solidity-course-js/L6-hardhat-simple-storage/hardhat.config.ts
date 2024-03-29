import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config";

import "./tasks/block-number";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL ?? "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
  // Required to verify contracts on EtherScan
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  // Required to estimate gas cost, ran during tests
  gasReporter: {
    enabled: true, // true
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};

export default config;
