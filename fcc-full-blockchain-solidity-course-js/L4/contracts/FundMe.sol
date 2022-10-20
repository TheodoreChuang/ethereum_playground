// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "./PriceConverter.sol";

/// @notice Crowd funding
/// @author teddy
/// @custom:version 1.2.0
contract FundMe {
    // Attach library to type
    using PriceConverter for uint256;

    address public owner;
    uint256 public minimumUsd = 49 * 1e18; // match decimals of ETH

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    constructor() {
        owner = msg.sender;
    }

    /// @notice Donors can contribute funds (ETH)
    function fund() public payable {
        require(
            // msg.value is implicitly passed as the first arg into convertEthToUsd
            msg.value.convertEthToUsd() > minimumUsd,
            "Didn't meet minimal funding amount"
        );
        // Optimisation: dedupe multiple contributions from the same sender
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    /// @notice Owner can withdraw all funds (ETH) into their address
    /// Reset funders state
    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed to withdraw ETH");
    }

    /// @notice Access control: only owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
}
