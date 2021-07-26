# Liquidity Mining (experimental)

Basic example of liquidity mining

## Contracts

- UnderlyingToken:
  - liquidity (some ERC20 crypto asset)
- LiquidityPool:
  - handles deposits and withdrawals of liquidity
  - handles rewarding LPs
  - => LpToken:
    - deposit receipt for providing liquidity
  - => GoveranceToken:
    - minted tokens for LP rewards
