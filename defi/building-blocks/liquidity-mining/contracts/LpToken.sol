//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title LpToken
 * @notice deposit receipt for LPs who provide liquidity
 */
contract LpToken is ERC20 {
    constructor() ERC20("Lp Token", "LTK") {}
}
