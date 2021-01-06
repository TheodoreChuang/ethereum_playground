// ensure web3 is loaded first
const web3 = new Web3("http://localhost:9545");

const contractABI = [];
const contractAddress = "0x2131e38bc0f47F6490d7E6fB70C519Cc4C785BaF";

const simpleSmartContract = new web3.eth.Contract(contractABI, contractAddress);
console.log(
  "🚀 ~ file: bundle.js ~ line 8 ~ simpleSmartContract",
  simpleSmartContract
);

web3.eth.getAccounts().then(console.log);
