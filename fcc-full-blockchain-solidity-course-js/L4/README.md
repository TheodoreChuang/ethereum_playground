## FundMe.sol

#### v1.0.0

Goerli: 0x6cA2d9691c1FbA04d2dF14e07b8B277188E68A5f

- Add FundMe.sol
  - Basic fund()
  - Convert ETH to USD with chainlink price feed

#### v1.1.0

- FundMe.sol
  - Store funders
- Add PriceConverter.sol
- Refactor pricing and conversion logic to PriceConverter library

#### v1.2.0

Goerli: 0x9Ad1e6BFFF0F7d592EE37f674a880d9bA4AebD7C

- FundMe.sol
  - Withdraw()
    - `call` is the recommended method - https://solidity-by-example.org/sending-ether/

#### v1.3.0

- FundMe.sol (v1.2.0 was 866767 -> 741547)
  - Gas optimisations
    - constant and immutable (2) (-42151)
    - custom errors (3) (-83069)
