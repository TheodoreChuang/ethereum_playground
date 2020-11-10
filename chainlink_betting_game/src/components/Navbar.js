import React from "react";
import dice_logo from "../logos/dice_logo.png";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="https://docs.chain.link/docs/get-a-random-number"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={dice_logo} height="32" alt="logo" />
        Betting Game
      </a>
      {!account ? (
        <div
          id="loader"
          className="spinner-border text-light"
          role="status"
        ></div>
      ) : (
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <a
            className="text-white"
            href={"https://rinkeby.etherscan.io/address/" + account}
            target="_blank"
            rel="noopener noreferrer"
          >
            {account}
          </a>
          &nbsp;
        </li>
      )}
    </nav>
  );
};

export default Navbar;
