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

  address private immutable i_owner;
  uint256 public constant MINIMUM_USD = 49 * 1e18; // match decimals of ETH

  address[] private s_funders;
  mapping(address => uint256) private s_addressToAmountFunded;

  AggregatorV3Interface private s_priceFeed;

  /// @notice Access control: only owner of the contract
  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert FundMe__OnlyOwner();
    }
    _;
  }

  constructor(address priceFeedAddress) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  /// @notice Donors can contribute funds (ETH)
  function fund() public payable {
    uint256 amount = msg.value.convertEthToUsd(s_priceFeed);
    if (amount < MINIMUM_USD) {
      revert FundMe__InsufficientAmount(amount);
    }

    s_funders.push(msg.sender);
    s_addressToAmountFunded[msg.sender] += msg.value;
  }

  function getAddressToAmountFunded(address funder)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[funder];
  }

  function getFunders(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }

  /// @notice Owner can withdraw all funds (ETH) into their address
  /// @dev Reset funders state
  function withdraw() public onlyOwner {
    address[] memory funders = s_funders;
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    s_funders = new address[](0);

    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    if (!callSuccess) {
      revert FundMe__WithdrawFailed();
    }
  }
}
