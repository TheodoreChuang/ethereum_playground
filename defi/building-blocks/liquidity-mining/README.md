# Liquidity Mining (experimental)

Basic example of liquidity mining

## Contracts

- UnderlyingToken:
  - liquidity (some ERC20 crypto asset)
- LiquidityPool:
  - handles deposits and withdrawals of liquidity via LP tokens
  - handles rewarding LPs with governance tokens
  - => LpToken:
    - deposit receipt for providing liquidity
  - => GoveranceToken:
    - minted tokens for LP rewards
  - V1 distributes rewards based on liquidity amount with no cap
  - Potentially V2 could fix rewards per block and distribute to LPs pro rata
