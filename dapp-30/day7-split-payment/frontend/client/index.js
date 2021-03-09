import Web3 from "web3";
import SplitPayment from "../build/contracts/SplitPayment.json";

let web3;
let splitPayment;

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
  const networkId = Object.keys(SplitPayment.networks)[0];
  return new web3.eth.Contract(
    SplitPayment.abi,
    SplitPayment.networks[networkId].address
  );
};

const initApp = async () => {
  const accounts = await web3.eth.getAccounts();
  const $send = document.getElementById("send");
  const $sendResult = document.getElementById("send-result");

  $send.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipients = e.target.elements[0].value.split(",");
    const amounts = e.target.elements[1].value.split(",");
    const value = amounts.reduce((sum, val) => Number(sum) + Number(val));

    splitPayment.methods
      .sendPayment(recipients, amounts)
      .send({ from: accounts[0], value })
      .then(() => {
        $sendResult.innerHTML = `Transfer sent!`;
      })
      .catch(() => {
        $sendResult.innerHTML = `Ooops... there was an error while trying to send a split payment...`;
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      splitPayment = initContract();
      initApp();
    })
    .catch((e) => console.log(e.message));
});
