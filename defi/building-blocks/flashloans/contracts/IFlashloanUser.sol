//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface IFlashloanUser {
    /// @param amount amount to borrow
    /// @param token token to borrow
    function flashloanCallback(uint256 amount, address token) external;
}
