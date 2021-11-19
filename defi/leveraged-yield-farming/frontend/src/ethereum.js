import { ethers, Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";

import { DAI_ABI } from "./addresses";
import YieldFarmer from "./contracts/YieldFarmer.json";
import addresses from "./addresses.js";

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545";
const localProvider = new JsonRpcProvider(localProviderUrl);

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        // ****** start snatch DAI ******
        // let accountToImpersonate = "0x1e3d6eab4bcf24bcd04721caa11c478a2e59852d";
        // await localProvider.send("hardhat_impersonateAccount", [accountToImpersonate]);
        // const signerImpersonate = await localProvider.getSigner(accountToImpersonate);
        // console.log(signerImpersonate.provider.getSigner());
        // const myDaiContract = new Contract(addresses.dai, DAI_ABI, signerImpersonate);

        // const myAddress = await signerImpersonate.getAddress();
        // console.log("myAddress", myAddress);
        // console.log("🚀 ~ file: ethereum.js ~ line 35 ~ window.addEventListener ~ myDaiContract", myDaiContract);
        // const signerDaiBal = await myDaiContract.balanceOf(myAddress);
        // console.log("vsignerDaiBal", signerDaiBal);

        // let transferbal = parseFloat(formatEther(signerDaiBal)) - 0.01;
        // myDaiContract.transfer("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", parseEther(transferbal.toString()));
        // ****** end snatch DAI ******

        const yieldFarmer = new Contract(
          // YieldFarmer.networks[window.ethereum.networkVersion].address,
          "0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B",
          YieldFarmer.abi,
          signer
        );

        const dai = new Contract(addresses.dai, DAI_ABI, signer);

        resolve({ signerAddress, yieldFarmer, dai });
      }
      resolve({ signerAddress: undefined, yieldFarmer: undefined });
    });
  });

export default getBlockchain;
