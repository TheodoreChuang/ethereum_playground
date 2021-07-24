// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IMockOracle.sol";

/**
 * @title StableCoin
 * @notice a simple implementation of a crypto-backed stablecoin
 *  This stablecoin targets a reserve of 200% (50% LTV) backed by ETH
 * @custom:experimental This is an experimental contract.
 */
contract StableCoin is ERC20 {
    IMockOracle public oracle;
    address public admin;

    uint256 public collateralFactor = 2; // 50% LTV
    uint256 public targetPrice = 10**decimals(); // 1 token = 10 ** 18 = 1 USD
    uint256 public initialSupply = 100000 * (10**decimals()); // 100,000 tokens

    struct Position {
        uint256 collateral;
        uint256 token;
    }
    mapping(address => Position) public positions;

    constructor(address _oracle) ERC20("ETH Backed Token", "ethUSD") {
        oracle = IMockOracle(_oracle);
        admin = msg.sender;

        _mint(address(this), initialSupply);
    }

    /// @notice Attempt to maintain price stability by adjusting supply
    function adjustSupply(uint256 price) external {
        require(msg.sender == admin, "only admin");

        if (price > targetPrice) {
            // (totalSupply + toMint) * targetPrice = totalSupply * price
            // (10000 + X) * 1 = 100000 * 1.02
            // x = 100000 * 1.02 - 100000
            // x => 2000 (2%)

            uint256 toMint = (totalSupply() * price) /
                targetPrice -
                totalSupply();
            _mint(address(this), toMint);
        } else {
            // (totalSupply - toBurn) * targetPrice = totalSupply * price
            // (100000 - X) * 1 = 100000 * .98
            // x = -(100000 * .98 - 100000)
            // x => 2000 (2%)

            uint256 toBurn = totalSupply() -
                (totalSupply() * price) /
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

        uint256 tokenRedeemRation = positions[msg.sender].token / amount;
        uint256 collateralChange = positions[msg.sender].collateral /
            tokenRedeemRation;

        positions[msg.sender].collateral -= collateralChange;
        positions[msg.sender].token -= amount;

        _burn(msg.sender, amount);
        (bool success, ) = msg.sender.call{value: collateralChange}("");
        require(success, "collateral transfer failed");
    }

    /// @notice Allow anyone to immediately liquidate any position above LTV
    function liquidatePosition(address owner) external {
        Position storage position = positions[owner];
        uint256 etherPrice = oracle.getEtherPrice();

        require(
            position.collateral * etherPrice <
                position.token * collateralFactor,
            "not liquidatable"
        );

        uint256 iCollateral = position.collateral;
        uint256 iToken = position.token;
        position.collateral = 0;
        position.token = 0;

        _burn(owner, iToken);
        (bool success, ) = payable(owner).call{value: iCollateral}("");
        require(success, "collateral transfer failed");
    }
}
