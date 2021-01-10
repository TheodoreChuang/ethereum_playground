const simpleStorageABI = [
  {
    inputs: [],
    name: "data",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_data",
        type: "string",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
const simpleStorageAddress = "0x2131e38bc0f47F6490d7E6fB70C519Cc4C785BaF";
const web3 = new Web3("http://localhost:9545");
const simpleStorage = new web3.eth.Contract(
  simpleStorageABI,
  simpleStorageAddress
);

document.addEventListener("DOMContentLoaded", () => {
  const setData = document.getElementById("setData");
  const data = document.getElementById("data");
  let accounts = [];

  web3.eth.getAccounts().then((_accounts) => {
    accounts = _accounts;
  });

  const getData = () => {
    simpleStorage.methods
      .data()
      .call()
      .then((result) => {
        data.innerHTML = result;
      });
  };

  getData();

  setData.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = e.target.elements[0].value;

    simpleStorage.methods
      .setData(data)
      .send({ from: accounts[0] })
      .then(getData);
  });
});
