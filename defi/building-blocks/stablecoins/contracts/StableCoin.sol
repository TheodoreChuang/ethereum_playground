// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IMockOracle.sol";

// does having an arbitrary initial supply make sense?
// treasury ?? what for? adjust supply some how?

/**
 * @title StableCoin
 * @notice a simple implementation of a crypto-backed stablecoin
 *  This stablecoin targets a reserve of 200% (50% LTV) backed by ETH
 * @custom:experimental This is an experimental contract.
 */
contract StableCoin is ERC20 {
    IMockOracle public oracle;
    uint256 public targetPrice = 10**decimals(); // 1 token = 10 ** 18 = 1 USD
    uint256 public initialSupply = 1000000 * (10**decimals()); // 100,000 tokens
    // uint256 public treasury = 10000; // 10,000 tokens

    struct Position {
        uint256 collateral;
        uint256 token;
    }
    mapping(address => Position) public positions;
    uint256 public collateralFactor = 2; // 50% LTV

    constructor(address _oracle) ERC20("ETH Backed Token", "ethUSD") {
        oracle = IMockOracle(_oracle);
        _mint(msg.sender, initialSupply);
    }

    /// @notice test oracle
    // function testOracle() external view returns (uint256) {
    //     return oracle.getEtherPrice();
    // }

    /// @notice Attempt to maintain price stability by adjusting supply
    function adjustSupply(uint256 price) external {
        // require(msg.sender == oracle, "only oracle"); // TODO <-- is this right?? extend Oracle contracts or triggered by admin?

        uint256 currentPrice = oracle.getEtherPrice(); // should this be price of collateral or stablecoin?
        if (price > targetPrice) {
            // (totalSupply + toMint) * targetPrice = totalSupply * currentPrice
            uint256 toMint = (totalSupply() * currentPrice) /
                targetPrice -
                totalSupply();
            _mint(address(this), toMint);
        } else {
            // (totalSupply - toBurn) * targetPrice = totalSupply * currentPrice
            uint256 toBurn = totalSupply() -
                (totalSupply() * currentPrice) /
                targetPrice;
            _burn(address(this), toBurn);
        }
    }

    /// @notice Deposit ETH collateral to mint stablecoins
    function borrowPosition(uint256 amount) external payable {
        require(amount >= 10**decimals(), "amount below minimum");

        uint256 etherPrice = oracle.getEtherPrice();
        require(
            msg.value * etherPrice >= amount * collateralFactor,
            "insufficient collateral"
        );

        positions[msg.sender].collateral += msg.value;
        positions[msg.sender].token += amount;

        _mint(msg.sender, amount);
    }

    /// @notice Return stablecoins to redeem ETH collateral
    /// Total position must be above required LTV
    function redeemPosition(uint256 amount) external payable {
        require(
            amount <= positions[msg.sender].token,
            "amount above total position"
        );

        uint256 etherPrice = oracle.getEtherPrice();
        // allow for 0.5% buffer in price to account for rounding in collateralChange
        require(
            positions[msg.sender].collateral * ((etherPrice * 1005) / 1000) >=
                positions[msg.sender].token * collateralFactor,
            "insufficient collateral"
        );

        // TODO handle dust/remainder amounts
        uint256 tokenRedeemRation = positions[msg.sender].token / amount;
        uint256 collateralChange = positions[msg.sender].collateral /
            tokenRedeemRation;

        positions[msg.sender].collateral -= collateralChange;
        positions[msg.sender].token -= amount;

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(collateralChange);
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
        payable(msg.sender).transfer(position.collateral);

        position.token = 0;
        position.collateral = 0;
    }
}
