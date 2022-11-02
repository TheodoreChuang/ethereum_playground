# Local Smart Contract Development with Hardhat

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

### Local Development (hardhat node)

Terminal 1:

```
$ yarn hardhat node
```

Terminal 2 (run commands):

```
$ yarn hardhat block-number
$ yarn hardhat run scripts/deploy.ts
```

### Testnet Development (ie. Goerli)

Set variables in .env
Run commands as like local but also provide `--network`

```
$ yarn hardhat block-number --network goerli
$ yarn hardhat run scripts/deploy.ts --network goerli
```

Contract deployed to Goerli via deploy.ts at 0x5D8F3BA5755aD70f588885b508131Ee628cDCb28
