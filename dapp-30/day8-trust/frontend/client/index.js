import Web3 from "web3";
import Trust from "../build/contracts/Trust.json";

let web3;
let trust;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => {
          resolve(new Web3(window.ethereum));
        })
        .catch((e) => {
          reject(e);
        });
      return;
    }
    if (typeof window.web3 !== "undefined") {
      return resolve(new Web3(window.web3.currentProvider));
    }
    resolve(new Web3("http://localhost:9545"));
  });
};

const initContract = () => {
  const networkId = Object.keys(Trust.networks)[0];
  return new web3.eth.Contract(Trust.abi, Trust.networks[networkId].address);
};

const initApp = async () => {
  const $balance = document.getElementById("balance");
  const $withdraw = document.getElementById("withdraw");
  const $withdrawResult = document.getElementById("withdraw-result");
  const accounts = await web3.eth.getAccounts();

  const refreshBalance = () => {
    web3.eth.getBalance(trust.options.address).then((balance) => {
      $balance.innerHTML = balance;
    });
  };

  $withdraw.addEventListener("submit", (e) => {
    e.preventDefault();
    trust.methods
      .withdraw()
      .send({ from: accounts[0] })
      .then(() => {
        $withdrawResult.innerHTML = "Withdrawal Successful! 💰";
        refreshBalance();
      })
      .catch((err) => {
        $withdrawResult.innerHTML =
          "Errored occured while trying to transfer the assets to the beneficiary";
        console.error(err);
      });
  });

  refreshBalance();
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      trust = initContract();
      initApp();
    })
    .catch((e) => console.log(e.message));
});
