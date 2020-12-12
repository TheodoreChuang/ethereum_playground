import Web3 from "web3";
import Wallet from "./contracts/MultiSigWallet.json";

/**
 * Get contract instance from contract artifact
 */
const getWallet = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const contractDeployment = Wallet.networks[networkId];
  console.log("contractDeployment", contractDeployment);
  return new web3.eth.Contract(Wallet.abi, contractDeployment?.address);
};

/**
 * Get instance of Web3
 */
const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // ensure js has been loaded
    window.addEventListener("load", async () => {
      // is MetaMask present? checks if there is a provider object
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // user needs to grant the dapp access to their MetaMask
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
        // if user is using an older version of MetaMask
      } else if (window.web3) {
        resolve(window.web3);
      } else {
        reject("Must install MetaMask to use this dapp");
      }
    });
  });
};

export { getWallet, getWeb3 };
