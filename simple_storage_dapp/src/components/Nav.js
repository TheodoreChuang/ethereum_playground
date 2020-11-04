import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./Nav.css";

function Nav() {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");

  const loadAccount = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");
    const network = await web3.eth.net.getNetworkType();
    setNetwork(network);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  useEffect(() => loadAccount(), []);

  return (
    <div>
      Your connected address: {account} ({network})
    </div>
  );
}
export default Nav;
