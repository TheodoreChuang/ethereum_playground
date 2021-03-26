import Web3 from "web3";
import TrustMultiPayout from "../build/contracts/TrustMultiPayout.json";

let web3;
let trustMultiPayout;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => {
          resolve(new Web3(window.ethereum));
        })
        .catch(e => {
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
  const networkId = Object.keys(TrustMultiPayout.networks)[0];
  return new web3.eth.Contract(TrustMultiPayout.abi, TrustMultiPayout.networks[networkId].address);
};

const initApp = async () => {
  const $balance = document.getElementById("balance");
  const $paidPayouts = document.getElementById("paid-payouts");
  const $earliest = document.getElementById("earliest");
  const $withdraw = document.getElementById("withdraw");
  const $withdrawResult = document.getElementById("withdraw-result");
  const accounts = await web3.eth.getAccounts();

  const maxPayouts = await trustMultiPayout.methods.PAYOUTS().call();
  const refreshBalance = () => web3.eth.getBalance(trustMultiPayout.options.address);
  const refreshPaidPayouts = () => trustMultiPayout.methods.paidPayouts().call();
  const refreshEarliest = () => trustMultiPayout.methods.earliest().call();

  const refresh = async () => {
    const [balance, paidPayouts, earliest] = await Promise.allSettled([
      refreshBalance(),
      refreshPaidPayouts(),
      refreshEarliest(),
    ]);
    $balance.innerHTML = balance.value;
    $paidPayouts.innerHTML = `${paidPayouts.value} of ${maxPayouts}`;
    $earliest.innerHTML = new Date(earliest.value * 1000).toLocaleString();
  };

  $withdraw.addEventListener("submit", async e => {
    e.preventDefault();

    const paidPayoutsBefore = $paidPayouts.innerHTML.slice(0, $paidPayouts.innerHTML.indexOf(" "));
    try {
      await trustMultiPayout.methods.withdraw().send({ from: accounts[0] });

      const paidPayoutsAfter = await refreshPaidPayouts();
      const isUpdate = paidPayoutsBefore !== paidPayoutsAfter;

      $withdrawResult.innerHTML = isUpdate
        ? "Transfer to beneficary successful! 💰"
        : "Too soon for the next withdrawal";

      if (maxPayouts === paidPayoutsAfter) $withdraw[0].setAttribute("disabled", true);
    } catch (e) {
      $withdrawResult.innerHTML = "Errored occured while trying to transfer the assets to the beneficiary";
      console.error(e);
    }
    refresh();
  });

  refresh();
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const _web3 = await initWeb3();
    web3 = _web3;
    trustMultiPayout = initContract();
    initApp();
  } catch (e) {
    console.error(`Error while initializing app. ${e}`);
  }
});
