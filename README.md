# Ethereum / Solidity

## Development

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbkFbU291cmNlIENvZGUgKi5zb2xdIFxuLS0-IEIoU29saWRpdHkgQ29tcGlsZXIpXG5CIC0tPiBDW0FCSV1cbkIgLS0-IERbQnl0ZWNvZGVdXG5DIC0tPiBFW1dlYjNdXG5EIC0tPnxEZXBsb3l8IEZbQ29udHJhY3QgSW5zdGFuY2Ugb24gbmV0d29yay9sb2NhbF1cbkUgLS0-IEZcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbkFbU291cmNlIENvZGUgKi5zb2xdIFxuLS0-IEIoU29saWRpdHkgQ29tcGlsZXIpXG5CIC0tPiBDW0FCSV1cbkIgLS0-IERbQnl0ZWNvZGVdXG5DIC0tPiBFW1dlYjNdXG5EIC0tPnxEZXBsb3l8IEZbQ29udHJhY3QgSW5zdGFuY2Ugb24gbmV0d29yay9sb2NhbF1cbkUgLS0-IEZcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

### Development Workflow (Truffle, Hardhat)

#### with Truffle

Truffle is a CLI tool. The workflow is like this:

Start a Truffle project with `truffle init`
Run a local development Blockchain with `truffle develop` (Truffle comes with its own version of Ganache)
Deploy your smart contract with `truffle migrate --reset` (the reset flag is necessary to avoid some caching problems)
Run smart contract test with `truffle test` (includes web3 and BN.js)
Deploy your frontend

#### Hardhat

- https://hardhat.org/getting-started/
- https://hardhat.org/tutorial/testing-contracts.html

Dependencies:
If using "@openzeppelin/test-helpers", then "require("@nomiclabs/hardhat-web3")"

### Nodes (Infura, Alchemy)

#### How to use Infura?

To deploy a smart contract to Infura you need to:

Create a project in Infura
Fund the deployment address (using a faucet in the case of testnet)
Add a configuration for this deployment in the configuration file of your Truffle project
Run the deployment with Truffle (ex: `truffle migrate --reset --network ropsten`)
We will see this in details later in this course in the section on smart contract deployment.

#### Alchemy

Free tier includes archival nodes

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
  - Nested Dynamic Arrays
    - OK in Solidity
    - Doesn't work in ABI/JS/Web3
    - String are stored as an array of chars ∴ an Array of Strings
    - experimental feature: pragma experimental ABIEncoderV2;

## Security:

- https://consensys.github.io/smart-contract-best-practices/
- https://arxiv.org/pdf/1806.01143.pdf

## Articles:

#### Ethereum basics

Intro - https://blog.b9lab.com/unpacking-the-ethereum-stack-for-developers-c1be1dc41c06

#### Data structures

Basic CRUD - https://medium.com/robhitchens/solidity-crud-part-1-824ffa69509a
Simply State Machine - https://medium.com/coinmonks/state-machines-in-solidity-9e2d8a6d7a11

#### Forking mainnet and other public networks:

Compound Example - https://medium.com/compound-finance/supplying-assets-to-the-compound-protocol-ec2cf5df5aa

#### Upgrading Smart Contracts:

https://github.com/jklepatch/eattheblocks/tree/master/screencast/372-smart-contract-upgrade

- Proxy Pattern: minimal proxy contract has a `fallback()`, contract requires assembly, memory of versions dependent on each other
- Adapter Pattern: main contract contains state and the functions but calls another contract for certain implementation logic. Implementation can be upgraded over time (ex. Yearn strategies).
- Migrator: New version is deployed with a migrator contract. Addresses can call the migrator contract to transfer state from older version to new version. This is a common pattern for tokens.
