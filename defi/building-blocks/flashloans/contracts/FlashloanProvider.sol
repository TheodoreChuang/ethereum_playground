//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./IFlashloanUser.sol";

/**
 * @title Flashloan Provider
 */
contract FlashloanProvider is ReentrancyGuard {
    // List of token available to be loaned
    mapping(address => IERC20) public tokens;

    constructor(address[] memory _tokens) {
        for (uint256 i = 0; i < _tokens.length; i++) {
            tokens[_tokens[i]] = IERC20(_tokens[i]);
        }
    }

    /// @notice Execute flashloan
    /// @param callback initiator
    /// @param amount amount to borrow
    /// @param _token token to borrow
    /// @param data arbitrary data
    function executeFlashloan(
        address callback,
        uint256 amount,
        address _token,
        bytes memory data
    ) external nonReentrant() {
        IERC20 token = tokens[_token];
        require(address(token) != address(0), "token not supported");

        uint256 originalBalance = token.balanceOf(address(this));
        require(originalBalance >= amount, "amount too high");

        token.transfer(callback, amount);
        IFlashloanUser(callback).flashloanCallback(amount, _token, data);

        require(
            token.balanceOf(address(this)) == originalBalance,
            "flashloan not reimbursed"
        );
    }
}
