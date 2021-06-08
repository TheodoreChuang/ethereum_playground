// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Weth is ERC20 {
    constructor() ERC20("Wrapped Ether", "WETH") {}

    ///@notice Exchange ETH for minted WETH
    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    ///@notice Exchange and burn WETH to ETH
    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "balance too low");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }
}
