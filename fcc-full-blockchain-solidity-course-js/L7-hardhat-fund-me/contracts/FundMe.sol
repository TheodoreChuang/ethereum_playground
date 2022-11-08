// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error InsufficientAmount(uint256 amount);
error OnlyOwner();
error WithdrawFailed();

/// @notice Crowd funding
/// @author teddy
contract FundMe {
  // Attach library to type
  using PriceConverter for uint256;

  address public immutable i_owner;
  uint256 public constant MINIMUM_USD = 49 * 1e18; // match decimals of ETH

  address[] public funders;
  mapping(address => uint256) public addressToAmountFunded;

  // ie. Goerli | Chainlink price feed | ETH / USD - 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
  AggregatorV3Interface public priceFeed;

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  /// @notice Donors can contribute funds (ETH)
  function fund() public payable {
    // msg.value is implicitly passed as the first arg into convertEthToUsd
    uint256 amount = msg.value.convertEthToUsd(priceFeed);
    if (amount < MINIMUM_USD) {
      revert InsufficientAmount(amount);
    }
    // Gas Optimisation?: dedupe multiple contributions from the same sender
    funders.push(msg.sender);
    addressToAmountFunded[msg.sender] += msg.value;
  }

  /// @notice Owner can withdraw all funds (ETH) into their address
  /// Reset funders state
  function withdraw() public onlyOwner {
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      addressToAmountFunded[funder] = 0;
    }

    funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    if (!callSuccess) {
      revert WithdrawFailed();
    }
  }

  /// @notice Access control: only owner of the contract
  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert OnlyOwner();
    }
    _;
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }
}
