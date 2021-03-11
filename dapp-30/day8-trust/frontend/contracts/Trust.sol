// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Trust {
    address public trustee;
    address payable public beneficiary;
    uint256 public earliest; // Unix Timestamp

    constructor(
        address _trustee,
        address payable _beneficiary,
        uint256 fromNow
    ) payable {
        trustee = _trustee;
        beneficiary = _beneficiary;
        earliest = block.timestamp + fromNow;
    }

    function withdraw() public {
        require(
            msg.sender == trustee,
            "Only the trustee can initiate the withdrawal"
        );
        require(
            block.timestamp >= earliest,
            "Required time has not yet passed"
        );
        beneficiary.transfer(address(this).balance);
    }
}
