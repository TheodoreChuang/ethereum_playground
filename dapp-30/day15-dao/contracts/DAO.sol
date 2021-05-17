// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * DAO contract:
 * Close end fund
 * 1. Collects investors money (ether) & allocate shares
 * 2. Keep track of investor contributions with shares
 * 3. Allow investors to transfer shares (redeem or transfer)
 * 4. allow investment proposals to be created and voted
 * 5. execute successful investment proposals (i.e send money)
 */
contract DAO {
    mapping(address => bool) public investors;
    mapping(address => uint256) public shares;
    uint256 public totalShares;
    uint256 public availableFunds;
    uint256 public contributionEnd;

    constructor(uint256 contributionTime) {
        contributionEnd = block.timestamp + contributionTime;
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
}
