# DeFi Development

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
