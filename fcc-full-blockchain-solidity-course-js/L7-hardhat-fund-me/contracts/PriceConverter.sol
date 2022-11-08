// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @notice Utility library to convert ETH to USD based on current price
/// @dev Configured for Goerli only
library PriceConverter {
  /// @notice Get latest ETH price in terms of USD from oracle
  function getPrice(AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    (, int256 price, , , ) = priceFeed.latestRoundData();

    // Price has 8 decimals, so multiple by 1e10 to match the decimals of ETH
    return uint256(price * 1e10);
  }

  /// @notice ETH in terms of USD
  function convertEthToUsd(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed);

    // General rule is to multiple/add before divide because Solidity doesn't support floats
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
    return ethAmountInUsd;
  }
}
