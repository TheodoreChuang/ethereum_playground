require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

const { abi, evm } = require('./compile')
const mnemonic = process.env.ACCOUNT_MNEMONIC
const network = process.env.RINKEBY_ENDPOINT

const provider = new HDWalletProvider(mnemonic, network)
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  console.log(`Attempting to deploy from account: ${accounts[1]}`)
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object,
    })
    .send({ from: accounts[1], gas: '1000000' })

  console.log(`Contract deployed at: ${result.options.address}`)
  provider.engine.stop()
}
deploy()
