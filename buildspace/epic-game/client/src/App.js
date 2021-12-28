import { ethers } from "ethers";
import { useEffect, useState } from "react";

import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { EPIC_GAME_CONTRACT_ADDRESS } from "./constants";
import { EpicGame, transformCharacterData } from "./utils";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";
import SelectCharacter from "./Components/SelectCharacter";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        if (ethereum.chainId !== null && ethereum.chainId !== "0x4") {
          alert("Switch to the Rinkeby network to play.");
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
        setIsLoading(false);
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

  /**
   * Determine content depending on account's state
   */
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  useEffect(() => {
    setIsLoading(true);
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

      setIsLoading(false);
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
