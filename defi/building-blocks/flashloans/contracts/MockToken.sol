//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice Mock Token for testing
 */
contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {}

    /// @notice faucet for testing
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
