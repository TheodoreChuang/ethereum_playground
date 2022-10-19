// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @notice
/// @author teddy
/// @custom:version 1.0.0
contract FundMe {
    uint256 public minimumUsd = 49 * 1e18; // match decimals of ETH

    /// @notice Donors can contribute funds (ETH)
    function fund() public payable {
        require(
            getConversionRate(msg.value) > minimumUsd,
            "Didn't meet minimal funding amount"
        );
    }

    /// @notice Get latest ETH price in terms of USD from oracle
    function getPrice() public view returns (uint256) {
        // Goerli | Chainlink price feed | ETH / USD - 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();

        // price has 8 decimals, so multiple by 1e10 to match the decimals of ETH
        return uint256(price * 1e10);
    }

    /// @notice ETH in terms of USD
    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice();

        // General rule is to multiple/add before divide because Solidity doesn't support floats
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }

    /// @notice Owner can withdraw all funds into their address
    // function withdraw() {}
}
