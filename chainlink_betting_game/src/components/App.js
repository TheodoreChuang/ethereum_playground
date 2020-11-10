import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";
import BettingGameAbi from "./abis/BettingGameAbi.json";

const contractAddress = "0xCf638b0B6A6F1a483792025d2349E77C33c04E7C"; //rinkeby

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

const App = () => {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxBet, setMaxBet] = useState(0);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();

    if (networkId !== 4) {
      window.alert("Please switch to the Rinkeby network and refresh the page");
    }

    const contract = new web3.eth.Contract(BettingGameAbi, contractAddress);
    setContract(contract);

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const balance = await web3.eth.getBalance(accounts[0]);
    setBalance(balance);

    const maxBet = await web3.eth.getBalance(contractAddress);
    setMaxBet(maxBet);
  };

  const makeBet = (bet, amount) => {
    //randomSeed will be component of which final random value will be generated
    var randomSeed = Math.floor(Math.random() * Math.floor(1e9));
    contract.methods
      .game(bet, randomSeed)
      .send({ from: account, value: amount })
      .on("transactionHash", () => {
        setLoading(true);
        contract.events.Result({}, (error, event) => {
          console.log("event", event);
          const verdict = event.returnValues.winAmount;
          if (verdict === "0") {
            window.alert("lose :(");
          } else {
            window.alert("WIN!");
          }
          setLoading(false);
          window.location.reload();
        });
      })
      .on("error", (error) => {
        window.alert("Error");
      });
  };

  const onChange = (value) => setAmount(value);

  return (
    <div>
      <Navbar account={account} />
      &nbsp;
      <Main
        loading={loading}
        amount={amount}
        balance={balance}
        makeBet={makeBet}
        maxBet={maxBet}
        onChange={onChange}
      />
    </div>
  );
};

export default App;
