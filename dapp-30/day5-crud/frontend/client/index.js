import Web3 from "web3";
import Crud from "../build/contracts/Crud.json";

let web3;
let crud;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => {
          resolve(new Web3(window.ethereum));
        })
        .catch((e) => {
          reject(e);
        });
      return;
    }
    if (typeof window.web3 !== "undefined") {
      return resolve(new Web3(window.web3.currentProvider));
    }
    resolve(new Web3("http://localhost:9545"));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(Crud.abi, Crud.networks[deploymentKey].address);
};

const initApp = () => {
  let accounts = [];
  web3.eth.getAccounts().then((_accounts) => {
    accounts = _accounts;
  });

  const $create = document.getElementById("create");
  const $createResult = document.getElementById("create-result");

  $create.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;

    crud.methods
      .userCreate(name)
      .send({ from: accounts[0] })
      .then(() => {
        $createResult.innerHTML = `New user ${name} was successfully created`;
      })
      .catch((err) => {
        $createResult.innerHTML = `Error occurred while creating new user: ${name}. ${err.message}`;
      });
  });

  const $read = document.getElementById("read");
  const $readResult = document.getElementById("read-result");

  $read.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;

    crud.methods
      .userRead(id)
      .call()
      .then((result) => {
        $readResult.innerHTML = `ID: ${result[0]} | Name: ${result[1]}`;
      })
      .catch((err) => {
        $readResult.innerHTML = `Error occurred while getting details for user ID ${id}. ${err.message}`;
      });
  });

  const $edit = document.getElementById("edit");
  const $editResult = document.getElementById("edit-result");

  $edit.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;

    crud.methods
      .userUpdate(id, name)
      .send({ from: accounts[0] })
      .then(() => {
        $editResult.innerHTML = `Changed name of user ID ${id} to ${name}`;
      })
      .catch((err) => {
        $editResult.innerHTML = `Error occurred while editing user ID ${id}'s name. ${err.message}`;
      });
  });

  const $delete = document.getElementById("delete");
  const $deleteResult = document.getElementById("delete-result");

  $delete.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;

    crud.methods
      .userDestroy(id)
      .send({ from: accounts[0] })
      .then(() => {
        $deleteResult.innerHTML = `Deleted user ID ${id}`;
      })
      .catch((err) => {
        $deleteResult.innerHTML = `Error occurred while deleting user ID ${id}. ${err.message}`;
      });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      crud = initContract();
      initApp();
    })
    .catch((err) => console.log(err.message));
});
