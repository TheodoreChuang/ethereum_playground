import { ethers } from "ethers";
import { useEffect, useState } from "react";

import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { EpicGame, transformCharacterData } from "./utils";

import SelectCharacter from "./Components/SelectCharacter";
import { EPIC_GAME_CONTRACT_ADDRESS } from "./constants";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Download the MetaMask extension first!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.warn(error);
    }
  };

  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const epicGame = new ethers.Contract(EPIC_GAME_CONTRACT_ADDRESS, EpicGame.abi, signer);

        const txn = await epicGame.checkIfUserHasNFT();
        if (txn.name) {
          console.log("User has character NFT");
          setCharacterNFT(transformCharacterData(txn));
        } else {
          console.log("No character NFT found");
        }
      } catch (error) {
        console.error("fetchNFTMetadata():", error);
      }
    };

    if (currentAccount) {
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
