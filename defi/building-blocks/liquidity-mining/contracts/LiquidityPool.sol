//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./UnderlyingToken.sol";
import "./GovernanceToken.sol";
import "./LpToken.sol";

/**
 * @title LiquidityPool V1
 * @notice Main liquidity mining contract
 *  handles deposits and withdrawals of liquidity via LP tokens (ERC20)
 *  handles rewarding LPs with governance tokens (ERC20)
 *      rewards based on liquidity amount per block with no cap
 */
contract LiquidityPool is LpToken {
    UnderlyingToken public underlyingToken;
    GovernanceToken public governanceToken;

    uint256 public constant REWARD_RATE = 1; // per block per liquidity asset

    // track last paid rewards (LP => block.number)
    mapping(address => uint256) public checkpoints;

    constructor(address _underlyingToken, address _governanceToken) {
        underlyingToken = UnderlyingToken(_underlyingToken);
        governanceToken = GovernanceToken(_governanceToken);
    }

    /// @notice LP can temporarily lock up the underlying crypto asset to mine governance tokens
    function deposit(uint256 amount) external {
        if (checkpoints[msg.sender] == 0) {
            checkpoints[msg.sender] = block.number;
        }
        _distributeReward(msg.sender);
        underlyingToken.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    /// @notice LP can withdraw their crypto asset at any time
    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "not enough LP tokens");
        _distributeReward(msg.sender);
        underlyingToken.transfer(msg.sender, amount);
        _burn(msg.sender, amount);
    }

    /// @notice Helper fn to calculate, track and mint governance tokens
    function _distributeReward(address beneficiary) internal {
        uint256 checkpoint = checkpoints[msg.sender];
        if (block.number > checkpoint) {
            checkpoints[beneficiary] = block.number;

            uint256 rewardAmount = (block.number - checkpoint) *
                REWARD_RATE *
                balanceOf(beneficiary);
            governanceToken.mint(beneficiary, rewardAmount);
        }
    }
}
