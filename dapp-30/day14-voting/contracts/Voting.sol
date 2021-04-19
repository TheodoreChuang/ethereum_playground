// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Voting
contract Voting {
    // Approved voters
    mapping(address => bool) public voters;
    // voter => ballotId => voted?
    mapping(address => mapping(uint256 => bool)) public votes;

    struct Choice {
        uint256 id;
        string name;
        uint256 votes;
    }
    struct Ballot {
        uint256 id;
        string name;
        uint256 end; // end timestamp
        Choice[] choices;
    }
    mapping(uint256 => Ballot) public ballots;
    uint256 nextBallotId;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    /// @notice Add addresses to list of approved voters
    function addVoters(address[] calldata _voters) external onlyAdmin() {
        for (uint256 i = 0; i < _voters.length; i++) {
            voters[_voters[i]] = true;
        }
    }

    /// @notice Create a new ballot
    function createBallot(
        string memory name,
        string[] memory choices,
        uint256 offset
    ) public onlyAdmin() {
        ballots[nextBallotId].id = nextBallotId;
        ballots[nextBallotId].name = name;
        ballots[nextBallotId].end = block.timestamp + offset;

        for (uint256 i = 0; i < choices.length; i++) {
            ballots[nextBallotId].choices.push(Choice(i, choices[i], 0));
        }
    }

    /// @notice Vote for ballot's choice
    function vote(uint256 ballotId, uint256 choiceId) external {
        require(voters[msg.sender] == true, "Only approved voters can vote");
        require(votes[msg.sender][ballotId] == false, "Already voted");
        require(block.timestamp < ballots[ballotId].end, "Voting has ended");

        votes[msg.sender][ballotId] = true;
        ballots[ballotId].choices[choiceId].votes++;
    }

    ///@notice Get the results of a ballot
    function results(uint256 ballotId) external view returns (Choice[] memory) {
        require(
            block.timestamp >= ballots[ballotId].end,
            "Cannot see the results before voting has ended"
        );

        return ballots[ballotId].choices;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }
}
