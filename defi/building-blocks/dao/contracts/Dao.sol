//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dao {
    enum Side {
        Yes,
        No
    }
    enum Status {
        Undecided,
        Approved,
        Rejected
    }
    struct Proposal {
        address author;
        bytes32 hash; // of proposal content
        uint256 createdAt;
        uint256 voteYes;
        uint256 voteNo;
        Status status;
    }

    IERC20 public token; // governance token
    uint256 constant CREATE_PROPOSAL_MIN_SHARE = 1000 * 10**18;
    uint256 constant VOTING_PERIOD = 7 days;
    uint256 constant PROPOSAL_QUORUM = 50; // 50%

    uint256 public totalShares;
    mapping(bytes32 => Proposal) public proposals;
    // member =>> proposals => has voted?
    mapping(address => mapping(bytes32 => bool)) public votes;
    mapping(address => uint256) public shares; // governance token

    constructor(address _token) {
        token = IERC20(_token);
    }

    /// @notice Deposit governance tokens/shares in order to participate in the DAO
    function deposit(uint256 amount) external {
        shares[msg.sender] += amount;
        totalShares += amount;
        token.transferFrom(msg.sender, address(this), amount);
    }

    /// @notice Withdraw previously deposited governance tokens/shares
    function withdraw(uint256 amount) external {
        require(
            shares[msg.sender] >= amount,
            "you cannot withdraw more other your own shares"
        );
        require(totalShares >= amount, "DAO does not have enough shares");

        shares[msg.sender] -= amount;
        totalShares -= amount;
        token.transfer(msg.sender, amount);
    }

    /// @notice Create a new proposal for the DAO to vote on
    function createProposal(bytes32 proposalHash) external {
        require(
            shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE,
            "insufficient shares to create a proposal"
        );
        require(
            proposals[proposalHash].hash == bytes32(0),
            "proposal already exists"
        );

        proposals[proposalHash] = Proposal(
            msg.sender,
            proposalHash,
            block.timestamp,
            0,
            0,
            Status.Undecided
        );
    }

    /// @notice Vote (yes or no) on an active proposal
    function vote(bytes32 proposalHash, Side side) external {
        Proposal storage proposal = proposals[proposalHash];
        require(
            proposals[proposalHash].hash != bytes32(0),
            "proposal not found"
        );
        require(
            proposal.status == Status.Undecided,
            "consensus has already been reached"
        );
        require(
            block.timestamp <= proposal.createdAt + VOTING_PERIOD,
            "voting period over"
        );
        require(votes[msg.sender][proposalHash] == false, "already voted");

        votes[msg.sender][proposalHash] = true;

        if (side == Side.Yes) {
            proposal.voteYes += shares[msg.sender];
            if ((proposal.voteYes * 100) / totalShares > PROPOSAL_QUORUM) {
                proposal.status = Status.Approved;
            }
        } else {
            proposal.voteNo += shares[msg.sender];
            if ((proposal.voteNo * 100) / totalShares > PROPOSAL_QUORUM) {
                proposal.status = Status.Rejected;
            }
        }
    }
}
