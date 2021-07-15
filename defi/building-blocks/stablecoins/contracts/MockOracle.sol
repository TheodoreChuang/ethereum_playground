// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Mock Price Oracle for testing purposes
 */
contract MockOracle {
    // uint256 private _decimals = 10**18; // ETH decimals
    // uint256 private currentPrice = 2000 * _decimals;
    uint256 private currentPrice = 2000;

    /// ETH price in USD (dollars)
    function getEtherPrice() external view returns (uint256) {
        return currentPrice;
    }

    /// @param price ETH price in USD (dollars)
    function updateEtherPrice(uint256 price) external returns (uint256) {
        // currentPrice = price * _decimals;
        currentPrice = price;
        return currentPrice;
    }
}
