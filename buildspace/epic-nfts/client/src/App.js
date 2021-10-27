import { ethers } from "ethers";
import { useEffect, useState } from "react";

import "./styles/App.css";
import EpicNFT from "./utils/EpicNFT.json";

const CONTRACT_ADDRESS = "0xF73c2eac06Bb6cD1310AE5870968ef25D2acf210";
const OPENSEA_LINK = "https://testnets.opensea.io/collection/squarenft-0ugd5yratb";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setUpEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setUpEventListener();
    } catch (error) {
      console.error(error);
    }
  };

  const setUpEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNFT.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log("Event: NewEpicNFTMinted", from, Number(tokenId));
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
      } else {
        console.warn("Ethereum object does exist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNft();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.warn("Ethereum object does exist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderConnectBtn = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintBtn = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT Kitties</p>
          <p className="sub-text">Each unique. Each beautiful. Discover your NFT today.</p>
          {currentAccount === "" ? renderConnectBtn() : renderMintBtn()}
        </div>
        <div className="footer-container">
          <a className="footer-text" href={OPENSEA_LINK} target="_blank" rel="noreferrer">
            View on OpenSea
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
