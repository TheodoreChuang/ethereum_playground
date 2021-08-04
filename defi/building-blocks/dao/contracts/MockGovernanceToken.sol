//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice Mock Governance Token for testing
 */
contract MockToken is ERC20 {
    constructor() ERC20("Mock Governance Token", "MGTK") {}

    /// @notice faucet for testing
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
