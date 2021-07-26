//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Governance tokens
 * @notice tokens to be distributed as rewards to LPs who provided liquidity
 */
contract GovernanceToken is ERC20, Ownable {
    constructor() ERC20("Governance Token", "GTK") Ownable() {}

    function mint(address to, uint256 amount) external onlyOwner() {
        _mint(to, amount);
    }
}
