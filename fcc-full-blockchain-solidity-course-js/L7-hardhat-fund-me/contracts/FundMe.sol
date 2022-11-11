// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__InsufficientAmount(uint256 amount);
error FundMe__OnlyOwner();
error FundMe__WithdrawFailed();

/// @title A contract for crowd funding
/// @author teddy
/// @notice This contract is to demo a sample funding contract
/// @dev Contract for tested for production
contract FundMe {
  using PriceConverter for uint256;

  address public immutable i_owner;
  uint256 public constant MINIMUM_USD = 49 * 1e18; // match decimals of ETH

  address[] public funders;
  mapping(address => uint256) public addressToAmountFunded;

  AggregatorV3Interface public priceFeed;

  /// @notice Access control: only owner of the contract
  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__OnlyOwner();
    }
    _;
  }

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  /// @notice Donors can contribute funds (ETH)
  function fund() public payable {
    uint256 amount = msg.value.convertEthToUsd(priceFeed);
    if (amount < MINIMUM_USD) {
      revert FundMe__InsufficientAmount(amount);
    }

    funders.push(msg.sender);
    addressToAmountFunded[msg.sender] += msg.value;
  }

  /// @notice Owner can withdraw all funds (ETH) into their address
  /// @dev Reset funders state
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
      revert FundMe__WithdrawFailed();
    }
  }
}
