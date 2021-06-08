// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20OP is ERC20 {
    address public admin;

    constructor(uint256 initialSupply) ERC20("BYB Token", "BYB") {
        admin = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    ///@notice Create additional token for admin
    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "only admin");
        _mint(to, amount);
    }

    ///@notice Create additional token for anyone
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
