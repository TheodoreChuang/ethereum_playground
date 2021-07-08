// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Interface: Mock Price Oracle for testing purposes
 */
interface MockOracle {
    function getEtherPrice() external view returns (uint256);

    function updateEtherPrice(uint256 price) external returns (uint256);
}
