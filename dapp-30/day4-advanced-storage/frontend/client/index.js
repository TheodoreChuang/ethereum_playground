import Web3 from "web3";

import AdvanceStorage from "../build/contracts/AdvancedStorage.json";

let web3;
let advanceStorage;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    // 1. new MetaMask is present
    if (typeof window.ethereum !== "undefined") {
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
    // 2. old MetaMask is present
    if (typeof window.web3 !== "undefined") {
      return resolve(new Web3(window.web3.currentProvider));
    }
    // 3. no MetaMask, connect to Ganache
    resolve(new Web3("http://localhost:9545"));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(AdvanceStorage.networks)[0];
  return new web3.eth.Contract(
    AdvanceStorage.abi,
    AdvanceStorage.networks[deploymentKey].address
  );
};

const initApp = () => {
  const $addData = document.getElementById("addData");
  const $data = document.getElementById("data");
  let accounts = [];

  web3.eth
    .getAccounts()
    .then((_accounts) => {
      accounts = _accounts;
      return advanceStorage.methods.getAll().call();
    })
    .then((results) => {
      $data.innerHTML = results.join(", ");
    });

  $addData.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = e.target.elements[0].value;

    advanceStorage.methods
      .add(data)
      .send({ from: accounts[0] })
      .then(() => {
        return advanceStorage.methods.getAll().call();
      })
      .then((results) => {
        $data.innerHTML = results.join(", ");
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      advanceStorage = initContract();
      initApp();
    })
    .catch((e) => console.error(e.message));
});
