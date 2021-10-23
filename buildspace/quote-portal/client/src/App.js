import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/QuotePortal.json";

// const contractAddress = "0x6cA2d9691c1FbA04d2dF14e07b8B277188E68A5f";
// const contractAddress = "0x9Ad1e6BFFF0F7d592EE37f674a880d9bA4AebD7C";
// const contractAddress = "0x250CB646596ce9f37D3B5dE082a378933B02Bf62";
const contractAddress = "0x2C6B719cFFf45d7DB5e55B400fb671c116ccB335";
const contractABI = abi.abi;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allQuotes, setAllQuotes] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.warn("Make sure you have MetaMask!");
      } else {
        console.log("Ethereum object found:", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found authorized account", account);
        setCurrentAccount(account);
        getAllQuotes();
      } else {
        console.log("No found authorized account");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllQuotes = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const quotePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const rawQuotes = await quotePortalContract.getAllQuotes();

        const quotes = rawQuotes
          .map(q => ({
            address: "0x***",
            timestamp: new Date(q.timestamp * 1000),
            message: q.message,
          }))
          .reverse();

        setAllQuotes(quotes);

        quotePortalContract.on("NewQuote", (from, timestamp, message) => {
          console.log("Event-NewQuote", from, timestamp, message);

          setAllQuotes(prevState => [
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
            ...prevState,
          ]);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const quote = async e => {
    e.preventDefault();

    const message = e.target.elements[0].value;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const quotePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await quotePortalContract.getTotalQuotes();
        console.log("Retrieved total quote count...", count.toNumber());
        // Set gas limit to minimize txn failure from low estimate
        const quoteTxn = await quotePortalContract.quote(message, { gasLimit: 300000 });
        console.log("Mining...", quoteTxn.hash);

        await quoteTxn.wait();
        console.log("Mined -- ", quoteTxn.hash);

        count = await quotePortalContract.getTotalQuotes();
        console.log("Retrieved total quote count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        {!currentAccount && (
          <button className="quoteButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="header">Daily Tao 🙏</div>

        <div className="connect">Connect your Ethereum wallet and add your own</div>

        <form onSubmit={quote}>
          <input type="text" />
          <br />
          <button className="quoteButton" type="submit">
            pondering on...
          </button>
        </form>

        {allQuotes.map((q, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {q.address}</div>
              <div>Time: {q.timestamp.toString()}</div>
              <div>Message: {q.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
