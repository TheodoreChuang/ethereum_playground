//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./FlashloanProvider.sol";
import "./IFlashloanUser.sol";

/**
 * @title Flashloan User
 */
contract FlashloanUser is IFlashloanUser {
    /// @notice Start flashloan
    /// @param amount amount to borrow
    /// @param token token to borrow
    function startFlashloan(
        address flashloan,
        uint256 amount,
        address token
    ) external {
        FlashloanProvider(flashloan).executeFlashloan(
            address(this),
            amount,
            token
        );
    }

    /// @notice flashloan callback after starting one
    function flashloanCallback(uint256 amount, address token)
        external
        override
    {
        // do something with loan and hopefully profit

        // FlashloanProvider needs to protect against reentrancy attacks here

        // reimburse flashloan
        IERC20(token).transfer(msg.sender, amount);
    }
}
