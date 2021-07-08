// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Mock Price Oracle for testing purposes
 */
contract MockOracle {
    uint256 currentPrice = 1;

    function getEtherPrice() external view returns (uint256) {
        return currentPrice;
    }

    function updateEtherPrice(uint256 price) external returns (uint256) {
        currentPrice = price;
        return price;
    }
}
