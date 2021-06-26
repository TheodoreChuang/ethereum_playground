const CoinGecko = require("coingecko-api");
const Oracle = artifacts.require("Oracle.sol");

const POLL_INTERVAL = 5000; // ms
const CoinGeckoClient = new CoinGecko();

// Truffle Script
module.exports = async done => {
  const [_, reporter] = await web3.eth.getAccounts();
  const oracle = await Oracle.deployed();

  while (true) {
    const response = await CoinGeckoClient.coins.fetch("bitcoin", {});
    const currentPrice = parseFloat(response.data.market_data.current_price.usd);

    // soliditySha3 is equivalent to Solidity's keccak256
    await oracle.updateData(web3.utils.soliditySha3("BTC/USD"), currentPrice, { from: reporter });
    console.log(
      `[price-watcher]: New price for BTC/USD ${currentPrice} updated on-chain with key ${web3.utils.soliditySha3(
        "BTC/USD"
      )}`
    );

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }

  done();
};
