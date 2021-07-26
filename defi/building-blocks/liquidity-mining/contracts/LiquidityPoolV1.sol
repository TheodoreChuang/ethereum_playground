//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

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
        // update checkpoints if first time
        // _distributeReward()
        // underlyingToken.transferFrom
        // _mint()
    }

    /// @notice LP can withdraw their crypto asset at any time
    function withdraw(uint256 amount) external {
        // check sender's balance of LP token >= amount
        // _distributeReward()
        // underlyingToken.transfer
        // _burn()
    }

    /// @notice Helper fn to calculate, track and mint governance tokens
    function _distributeReward(address beneficiary) internal {
        // if current block.number > checkpoints {
        //     calculate rewardAmount
        //     governanceToken.mint()
        //     checkpoints[beneficiary] = block.number
        // }
    }
}
