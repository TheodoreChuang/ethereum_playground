# Ethereum / Solidity

## Development

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbkFbU291cmNlIENvZGUgKi5zb2xdIFxuLS0-IEIoU29saWRpdHkgQ29tcGlsZXIpXG5CIC0tPiBDW0FCSV1cbkIgLS0-IERbQnl0ZWNvZGVdXG5DIC0tPiBFW1dlYjNdXG5EIC0tPnxEZXBsb3l8IEZbQ29udHJhY3QgSW5zdGFuY2Ugb24gbmV0d29yay9sb2NhbF1cbkUgLS0-IEZcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbkFbU291cmNlIENvZGUgKi5zb2xdIFxuLS0-IEIoU29saWRpdHkgQ29tcGlsZXIpXG5CIC0tPiBDW0FCSV1cbkIgLS0-IERbQnl0ZWNvZGVdXG5DIC0tPiBFW1dlYjNdXG5EIC0tPnxEZXBsb3l8IEZbQ29udHJhY3QgSW5zdGFuY2Ugb24gbmV0d29yay9sb2NhbF1cbkUgLS0-IEZcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

### Custom Scaffold

./compile.js
./test/
./contracts/

- Manual Set Up (without framesworks):

  - solidity compiler: solc
  - testing: mocha
  - local network + provider: ganache-cli
  - integrating client with network (deploy new or interact with existing contract): web3

- Remix:

  - web IDE
  - manual testing
  - compile / deployment

- Truffle:
  - contract creation
  - automated testing (JS: mocha, Solidity)
  - deploying to networks

### Test Networks

Infura or host own node

- Ropsten:
  - most similar to main net ∴ use occasionally
  - slow block times
- Rinkeby:
  - least similar to main net than Ropsten ∴ use frequently
  - fast block times

## Notes

- gasPrice (Wei/gas): amount of Wei the sender is willing to pay per unit of gas
- startGas/gasLimit (gas): total units of gas willing to spend for the transaction

## Gotchas

- Contract Functions:
  - call()
    - cannot modify data
    - returns data instantly from node (does not require processing a new block)
  - send()
    - modify a contracts data/state
    - takes block time!! ∴ think about the UX
    - returns a transaction hash
    - cost gas
  - Nested Dynamic Arrays
    - OK in Solidity
    - Doesn't work in ABI/JS/Web3
    - String are stored as an array of chars ∴ an Array of Strings
    - experimental feature: pragma experimental ABIEncoderV2;

## Articles:

Intro - https://blog.b9lab.com/unpacking-the-ethereum-stack-for-developers-c1be1dc41c06
Basic CRUD - https://medium.com/robhitchens/solidity-crud-part-1-824ffa69509a
Simply State Machine - https://medium.com/coinmonks/state-machines-in-solidity-9e2d8a6d7a11
