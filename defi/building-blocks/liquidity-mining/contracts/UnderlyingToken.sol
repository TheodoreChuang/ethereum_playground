//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice mock Underlying Token for testing
 */
contract UnderlyingToken is ERC20 {
    constructor() ERC20("Underlying Token", "UTK") {}

    /// @notice faucet for testing
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
