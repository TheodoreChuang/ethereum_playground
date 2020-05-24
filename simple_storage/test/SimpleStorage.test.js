const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const { abi, evm } = require('../compile')

const web3 = new Web3(ganache.provider())

const initialArgs = ['stacking sats']
let accounts
let simpleStorage

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  simpleStorage = await new web3.eth.Contract(abi)
    .deploy({ data: '0x' + evm.bytecode.object, arguments: initialArgs })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('SimpleStorage', () => {
  it('contract deploys and has an address', () => {
    assert.ok(simpleStorage.options.address)
  })

  it('deploys with a  default message', async () => {
    const message = await simpleStorage.methods.message().call()
    assert.equal(message, initialArgs[0])
  })

  it('can set a new message', async () => {
    const newMessage = 'hodl hodl'
    await simpleStorage.methods.setMessage(newMessage).send({ from: accounts[0] })

    const getMessage = await simpleStorage.methods.message().call()
    assert.equal(getMessage, newMessage)
  })
})
