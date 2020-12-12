# Multi-sig Wallet

Creates a wallet pre-configured with approvers and the required quorum to send a transactions.

## Deployment

### Contract

Configure the approvers in `.env.json`, `truffle-config.js`, and `2_deploy_multisigwallet_contract`

Deployed Rinkeby: 0x48e144EdE66958A7ba2f82f6ad7040dCDd047BDF

### Client

https://vigilant-meninsky-651845.netlify.app/

Deploying to mainnet
The process is exactly the same:

Deploy smart contract
Run the build for the frontend code
Upload the build folder to a server like netlify

The only differences are;

In Infura, select "mainnet" to get the correct endpoint
In your `truffle-config.js` file, you need to update the Infura endpoint url to the one for mainnet
This time you can't get free ether with a mainnet faucet (that would be free money!). Instead, you need to first buy some Ether at an exchange like Cex or Coinbase. You don't need much to get started. I would recommend buying for 5-10 USD of Ether. Each deployment should cost you between 20-30 cents.
