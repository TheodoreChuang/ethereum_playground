import Web3 from "web3";
import Wallet from "./contracts/MultiSigWallet.json";

/**
 * Get contract instance from contract artifact
 */
const getWallet = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const contractDeployment = Wallet.networks[networkId];
  return new web3.eth.Contract(Wallet.abi, contractDeployment?.address);
};

/**
 * Get instance of Web3
 */
const getWeb3 = () => {
  return new Web3("http://localhost:9545");
};

export { getWallet, getWeb3 };
