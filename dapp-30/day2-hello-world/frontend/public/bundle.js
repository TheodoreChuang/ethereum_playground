const contractABI = [
  {
    inputs: [],
    name: "hello",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
  },
];
const contractAddress = "0x2131e38bc0f47F6490d7E6fB70C519Cc4C785BaF"; // from ganache
const web3 = new Web3("http://localhost:9545");

const helloWorld = new web3.eth.Contract(contractABI, contractAddress);

document.addEventListener("DOMContentLoaded", () => {
  helloWorld.methods
    .hello()
    .call()
    .then((result) => {
      document.getElementById("hello").innerHTML = result;
    });
});
