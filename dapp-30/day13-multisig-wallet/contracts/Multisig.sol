// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Basic Multisig wallet
contract Multisig {
    address[] public approvers;
    uint256 public quorum;
    mapping(uint256 => Transfer) public transfers;
    uint64 public nextId = 0;
    // approver => (nextId => isSent)
    mapping(address => mapping(uint64 => bool)) public approvals;

    struct Transfer {
        uint64 id;
        uint256 amount;
        address payable to;
        uint8 approvals;
        bool isSent;
    }

    constructor(address[] memory _approvers, uint256 _quorum) payable {
        approvers = _approvers;
        quorum = _quorum;
    }

    /// @notice Transfer step 1/2: create a pending transfer for the approvers to approve
    function createTransfer(uint256 amount, address payable to)
        external
        onlyApprover()
    {
        transfers[nextId] = Transfer(nextId, amount, to, 0, false);

        nextId++;
    }

    /// @notice Transfer step 2/2: approval a transfer and sent if the quorum has been reached
    function sendTransfer(uint64 id) external onlyApprover() {
        require(
            transfers[id].isSent == false,
            "Transfer has already been sent"
        );

        if (approvals[msg.sender][id] == false) {
            approvals[msg.sender][id] = true;
            transfers[id].approvals++;
        }

        if (transfers[id].approvals >= quorum) {
            transfers[id].isSent = true;
            address payable to = transfers[id].to;
            uint256 amount = transfers[id].amount;
            to.transfer(amount);
            return;
        }
    }

    modifier onlyApprover() {
        bool isAllowed = false;

        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                isAllowed = true;
                break;
            }
        }

        require(isAllowed == true, "Only approver allowed");
        _;
    }
}
