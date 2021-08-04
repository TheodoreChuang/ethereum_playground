# DeFi Development

## DeFi Caveats and Risks

- generally high transaction fees on L1
- smart contract risk
- impermanent loss
- liquidation risk

## Defi Building Blocks

- ERC-20 (fungible tokens)
  - transfer, approve, transferFrom; \_mint
  - https://eips.ethereum.org/EIPS/eip-20
  - https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
  - https://docs.openzeppelin.com/contracts/4.x/api/token/erc20
- ERC-721 (NFTs)
  - optional: metadata extension, enumerable extension
  - https://eips.ethereum.org/EIPS/eip-721
  - https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
  - https://docs.openzeppelin.com/contracts/4.x/api/token/erc721
- Wrapped Ether (wETH)
  - Why? Compatibility with ERC-20 in order to faciliate trading
  - https://weth.io/
  - https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
- Collateral Backed Tokens
  - Examples: wETH, liquidity provider tokens (wrapped ERC-20)
- Oracles
  - Why? Incorporate external data from outside of the blockchain (ex. prices)
  - Two design patterns: pull based or push based
    - pull based: consumer pulls data from oracle
    - push based: consumer registers a callback and oracle calls callback with data
- Stablecoins
  - Uses cases: quote currency, collateral, payment
  - Types: fiat-based (USDC), crypto-based (DAI), algorithmic (Ampleforth)
  - Links:
    - https://stablecoinindex.com/
    - https://www.coingecko.com/en/stablecoins
    - https://defiprime.com/stablecoins
- AMM + DEX
  - Example: Uniswap - based on 'constant product formula' instead on an order book
    - Liquidity providers should be mindful of impairment loss
    - Traders should be mindful of slippage
- Liquidity Mining
  - Reward investors for providing liquid (depositing some asset) into a pool by providing them some governance token
  - https://medium.com/bollinger-investment-group/liquidity-mining-a-user-centric-token-distribution-strategy-1d05c5174641
- Yield Farming, some strategies
  - Crop Rotation: ex. via yield aggregrators like Yearn
  - Recursive Yield Farming: ex. USDC + USDT -> Compound -> Curve, etc.
  - Leverage Yield Farming
- Flashloans
  - borrow and reimburse within a single block; no collateral required
  - use cases:
    - arbitrage
    - liquidations
- DAO (Decentralised Autonomous Organization)
  - Members can create proposals for the community to vote on if proposer has sufficient shares (governance tokens)
  - Any member can vote on any proposal, weigthed by their number of shares (governance tokens)
  - Proposals automatically closed once quorum is meet
