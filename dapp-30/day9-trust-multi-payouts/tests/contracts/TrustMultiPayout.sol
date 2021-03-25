// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustMultiPayout {
    address public trustee;
    address payable public beneficiary;
    uint256 public earliest; // first payment (Unix Timestamp)
    uint256 public amount; // total value
    uint256 public constant PAYOUTS = 4;
    uint256 public constant INTERVAL = 2; // subsequent payments (seconds)
    uint256 public paidPayouts;

    constructor(
        address _trustee,
        address payable _beneficiary,
        uint256 fromNow
    ) payable {
        trustee = _trustee;
        beneficiary = _beneficiary;
        earliest = block.timestamp + fromNow;
        amount = msg.value / PAYOUTS;
    }

    function withdraw() public {
        require(
            msg.sender == trustee,
            "Only the trustee can initiate the withdrawal"
        );
        require(
            block.timestamp >= earliest,
            "Required time has not passed yet"
        );
        require(
            paidPayouts < PAYOUTS,
            "All payouts have already been withdrawn"
        );

        uint256 elligiblePayouts = 1 + (block.timestamp - earliest) / INTERVAL;
        uint256 duePayouts = elligiblePayouts - paidPayouts;
        duePayouts = duePayouts + paidPayouts > PAYOUTS
            ? PAYOUTS - paidPayouts
            : duePayouts;

        paidPayouts += duePayouts;

        beneficiary.transfer(duePayouts * amount);
    }
}
