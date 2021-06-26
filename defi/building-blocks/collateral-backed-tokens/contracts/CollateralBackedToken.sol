// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CollateralBackedToken is ERC20 {
    IERC20 public collateral;
    uint256 public price = 1;

    constructor(address _collateral) ERC20("Collateral Backed Token", "CBT") {
        collateral = IERC20(_collateral);
    }

    ///@notice Exchange ERC-20 for minted CBT. Sender first need to approve ERC-20 transfer.
    function deposit(uint256 collteralAmount) external payable {
        collateral.transferFrom(msg.sender, address(this), collteralAmount);

        _mint(msg.sender, collteralAmount * price);
    }

    ///@notice Exchange and burn CBT for ERC-20
    function withdraw(uint256 tokenAmount) external {
        require(balanceOf(msg.sender) >= tokenAmount, "balance too low");
        _burn(msg.sender, tokenAmount);

        collateral.transfer(msg.sender, tokenAmount / price);
    }
}
