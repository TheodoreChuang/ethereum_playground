import Web3 from "web3";
import EtherWallet from "../build/contracts/EtherWallet.json";

let web3;
let etherWallet;

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
  const networkId = Object.keys(EtherWallet.networks)[0];
  return new web3.eth.Contract(
    EtherWallet.abi,
    EtherWallet.networks[networkId].address
  );
};

const initApp = async () => {
  const $deposit = document.getElementById("deposit");
  const $depositResult = document.getElementById("deposit-result");
  const $send = document.getElementById("send");
  const $sendResult = document.getElementById("send-result");
  const $balance = document.getElementById("balance");
  const accounts = await web3.eth.getAccounts();

  const refreshBalance = () => {
    etherWallet.methods
      .balanceOf()
      .call()
      .then((result) => {
        $balance.innerHTML = result;
      });
  };
  refreshBalance();

  $deposit.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = e.target.elements[0].value;

    etherWallet.methods
      .deposit()
      .send({
        from: accounts[0],
        value: amount,
      })
      .then(() => {
        $depositResult.innerHTML = `Deposited ${amount} Wei`;
        e.target.elements[0].value = "";
        refreshBalance();
      })
      .catch((err) => {
        $depositResult.innerHTML =
          "Errored occured while trying to make a deposit";
        console.error(err);
      });
  });

  $send.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipient = e.target.elements[0].value;
    const amount = e.target.elements[1].value;

    etherWallet.methods
      .send(recipient, amount)
      .send({ from: accounts[0] })
      .then(() => {
        $sendResult.innerHTML = `Send ${amount} Wei to ${recipient}`;
        e.target.elements[0].value = "";
        e.target.elements[1].value = "";
        refreshBalance();
      })
      .catch((err) => {
        $sendResult.innerHTML = `Errored occured while trying send ${amount} Wei from the contract to ${recipient}`;
        console.error(err);
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      etherWallet = initContract();
      initApp();
    })
    .catch((e) => console.log(e.message));
});
