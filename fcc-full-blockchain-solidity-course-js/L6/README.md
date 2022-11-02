# Local Smart Contract Development with Hardhat

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

### Local Development (hardhat node)

Terminal 1:

```
$ yarn hardhat node
```

Terminal 2 (run commands):

```
<!-- Compile contract and typechain -->
$ yarn hardhat compile
<!-- run custom task: block-number -->
$ yarn hardhat block-number
<!-- run tests -->
$ yarn hardhat test
<!-- run test coverage -->
$ yarn hardhat coverage
<!-- run a script -->
$ yarn hardhat run scripts/deploy.ts
```

### Testnet Development (ie. Goerli)

Set variables in .env
Run most commands like local but also provide `--network`

```
$ yarn hardhat block-number --network goerli
```

Contract deployed to Goerli via deploy.ts at 0x5D8F3BA5755aD70f588885b508131Ee628cDCb28
