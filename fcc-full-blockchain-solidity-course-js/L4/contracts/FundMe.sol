// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "./PriceConverter.sol";

/// @notice Crowd funding
/// @author teddy
/// @custom:version 1.1.0
contract FundMe {
    // Attach library to type
    using PriceConverter for uint256;

    uint256 public minimumUsd = 49 * 1e18; // match decimals of ETH

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

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

    /// @notice Owner can withdraw all funds into their address
    // function withdraw() {}
}
