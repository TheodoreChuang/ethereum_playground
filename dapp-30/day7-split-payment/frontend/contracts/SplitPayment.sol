// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SplitPayment {
    address public owner = msg.sender;

    /// @notice Allocate receive amounts => recipients in the same order
    function sendPayment(
        address payable[] memory recipients,
        uint256[] memory amounts
    ) public payable onlyOwner() {
        require(
            recipients.length == amounts.length,
            "Number of recipients and amounts must match"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            recipients[i].transfer(amounts[i]);
        }
    }

    function balanceOf() public view onlyOwner() returns (uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 amount) public onlyOwner() {
        payable(owner).transfer(amount);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this action");
        _;
    }
}
