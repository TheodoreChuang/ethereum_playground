// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * DAO contract:
 * Close end fund
 * 1. Collects investors money (ether) & allocate shares (Wei = share)
 * 2. Keep track of investor contributions with shares
 * 3. Allow investors to transfer shares (redeem or transfer)
 * 4. Allow investment proposals to be created and voted
 * 5. Execute successful investment proposals (i.e send money)
 */
contract DAO {
    uint256 public totalShares;
    uint256 public availableFunds;
    uint256 public contributionEnd; // (seconds)
    uint256 public nextProposalId;
    uint256 public voteTime; // (seconds) voting period duration
    uint256 public quorum; // minimum required votes as percent of total (ex. 50 = 50%)
    address public admin;

    // investor => is investor?
    mapping(address => bool) public investors;
    // investor => number of shares
    mapping(address => uint256) public shares;
    // id => Proposal
    mapping(uint256 => Proposal) public proposals;
    // investor -> proposal id -> has voted?
    mapping(address => mapping(uint256 => bool)) public votes;

    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes; // number of shares in favor of
        uint256 end; // (time stamp) expiry
        bool executed;
    }

    constructor(
        uint256 contributionTime,
        uint256 _voteTime,
        uint256 _quorum
    ) {
        require(
            _quorum > 0 && _quorum < 100,
            "Quorum must be between 0 and 100%"
        );
        contributionEnd = block.timestamp + contributionTime;
        voteTime = _voteTime;
        quorum = _quorum;
        admin = msg.sender;
    }

    /// @notice Investor contribute ETH to DAO, receives shares
    function contribute() external payable {
        require(
            block.timestamp < contributionEnd,
            "Contribution period has ended"
        );

        investors[msg.sender] = true;
        shares[msg.sender] += msg.value;
        totalShares += msg.value;
        availableFunds += msg.value;
    }

    /// @notice Investor to redeem shares from DAO (convert their shares back to ETH)
    function redeemShare(uint256 amount) external {
        require(shares[msg.sender] >= amount, "You do not have enough shares");
        require(availableFunds >= amount, "DAO does not enough funds");

        shares[msg.sender] -= amount;
        totalShares -= amount;
        availableFunds -= amount;
        payable(msg.sender).transfer(amount);
    }

    /// @notice Investor to transfer shares with another address
    function transferShare(uint256 amount, address to) external {
        require(shares[msg.sender] >= amount, "You do not have enough shares");

        shares[msg.sender] -= amount;
        shares[to] += amount;
        investors[to] = true;
    }

    /// @notice Investor submits a new proposal for consideration
    function createProposal(
        string memory name,
        uint256 amount,
        address payable recipient
    ) external onlyInvestors() {
        require(availableFunds >= amount, "Not of enough funds");

        proposals[nextProposalId] = Proposal(
            nextProposalId,
            name,
            amount,
            recipient,
            0,
            block.timestamp + voteTime,
            false
        );

        availableFunds -= amount;
        nextProposalId++;
    }

    /// @notice Admin can wrap up a proposal and send funds if votes reached
    function executeProposal(uint256 proposalId) external onlyAdmin() {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.end, "Voting is not over yet");
        require(
            proposal.executed == false,
            "Proposal has already been executed"
        );
        // FIXME what if voting over and quorum not met? Need to release funds?
        require(
            ((proposal.votes * 100) / totalShares) >= quorum,
            "Quorum not met"
        );

        proposal.executed = true;
        _transferEth(proposal.recipient, proposal.amount);
    }

    /// @notice Investor can vote to accept a proposal
    function vote(uint256 proposalId) external onlyInvestors() {
        Proposal storage proposal = proposals[proposalId];

        require(votes[msg.sender][proposalId] == false, "Already voted");
        require(block.timestamp < proposal.end, "Voting period is over");

        votes[msg.sender][proposalId] = true;
        proposal.votes += shares[msg.sender];
    }

    /// @notice Admin can withdraw from DAO. Escape hatch only.
    function withdrawEth(address payable to, uint256 amount)
        external
        onlyAdmin()
    {
        _transferEth(to, amount);
    }

    function _transferEth(address payable to, uint256 amount) internal {
        require(amount <= availableFunds, "Not enough available funds");

        availableFunds -= amount;
        to.transfer(amount);
    }

    /// @notice DAO can receive funds
    receive() external payable {
        availableFunds += msg.value;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyInvestors() {
        require(investors[msg.sender] == true, "Only investors");
        _;
    }
}
