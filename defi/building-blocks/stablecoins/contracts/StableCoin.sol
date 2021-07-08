// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IMockOracle.sol";

// does having an arbitrary initial supply make sense?
// totalSupply ??
// treasury ??

/**
 * @title StableCoin
 * @notice a simple implementation of a crypto-backed stablecoin
 *  This stablecoin targets a reserve of 150% backed by ETH
 * @custom:experimental This is an experimental contract.
 */
contract StableCoin is ERC20 {
    address public oracle;
    uint256 public targetPrice = 10**18; // 1 token = 10 ** 18 = 1 USD
    uint256 public initialSupply = 1000000 * 10 * 18; // 100,000 tokens
    // totalSupply ??
    // uint256 public treasury = 10000; // 10,000 tokens

    struct Position {
        uint256 collateral;
        uint256 token;
    }
    mapping(address => Position) public positions;
    uint256 public collateralFactor = 150;

    constructor(address _oracle) ERC20 {
        oracle = _oracle;
        _mint(msg.sender, initialSupply);
        // totalSupply = initialSupply;
    }

    /// @notice Attempt to maintain price stability by adjusting supply
    function adjustSupply(uint256 price) external {
        require(msg.sender == oracle, "only oracle"); // TODO <-- is this right?? extend Oracle contracts or triggered by admin?

        if (price > targetPrice) {
            // (totalSupply + toMint) * targetPrice = totalSupply * currentPrice
            uint256 toMint = (totalSupply * currentPrice) /
                targetPrice -
                totalSupply;
            _mint(address(this), toMint);
        } else {
            // (totalSupply - toBurn) * targetPrice = totalSupply * currentPrice
            uint256 toBurn = totalSupply -
                (totalSupply * currentPrice) /
                targetPrice;
            _burn(address(this), toBurn);
        }
    }

    /// @notice Deposit ETH collateral to mint stablecoins
    function borrowPosition(uint256 amount) external payable {
        uint256 etherPrice = oracle.getEtherPrice();
        require(amount > 10**18, "amount too low");
        require(msg.value * 100 >= etherPrice * amount * collateralFactor);

        positions[msg.sender].collateral += msg.value;
        positions[msg.sender].token += amount;
        // totalSupply += amount

        _mint(msg.sender, amount);
    }

    /// @notice Return stablecoins to redeem ETH collateral
    function redeemPosition(uint256 amount) external payable {
        uint256 etherPrice = oracle.getEtherPrice();
        require(amount > 10**18, "amount too low");
        require(msg.value * 100 >= etherPrice * amount * collateralFactor);

        positions[msg.sender].collateral -= msg.value; // += ??
        positions[msg.sender].token -= amount; // += ??
        // totalSupply -= amount

        _burn(msg.sender, amount);
    }

    /// @notice
    function liquidatePosition(address owner) external {
        Position storage position = positions[owner];
        uint256 etherPrice = oracle.getEtherPrice();
        require(
            position.token * collateralFactor <
                position.collateral * etherPrice,
            "not liquidatable"
        );

        _burn(msg.sender, position.token);
        msg.sender.transfer(position.collateral);

        // totalSupply -= position.token
        position.token = 0;
        position.collateral = 0;
    }
}
