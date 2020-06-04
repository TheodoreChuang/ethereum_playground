const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '1500000' })

  await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1500000' })
  ;[campaignAddress] = await factory.methods.getDeployedCampaigns().call()
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaign Contract', () => {
  describe('contract deployment', () => {
    it('deploys a factory and campaign; and they both have an address', () => {
      assert.ok(factory.options.address)
      assert.ok(campaign.options.address)
    })

    it('marks contract creator as the campaign manager', async () => {
      const manager = await campaign.methods.manager().call()

      assert.equal(accounts[0], manager)
    })
  })

  describe('contribute()', () => {
    it('allows people to contribute to a campaign and marks them as approvers', async () => {
      await campaign.methods.contribute().send({ from: accounts[1], value: '200' })

      const isContributor = await campaign.methods.approvers(accounts[1]).call()
      assert(isContributor)
    })

    it('requires contributions to meet the set minimum value', async () => {
      try {
        await campaign.methods.contribute().send({ from: accounts[1], value: '42' })
        assert(false)
      } catch (err) {
        assert(err)
      }
    })
  })

  describe('campaign requests', () => {
    it('manager can createRequest() a payment request', async () => {
      await campaign.methods
        .createRequest('Buy batteries', '100', accounts[1])
        .send({ from: accounts[0], gas: '1000000' })

      const request = await campaign.methods.requests(0).call()
      assert.equal('Buy batteries', request.description)
      assert.equal(false, request.complete)
      assert.equal(0, request.approvalCount)
    })

    it('flow from create to finalize', async () => {
      // New contribution
      await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('10', 'ether') })

      // Create a new Request, pays account[2]
      await campaign.methods
        .createRequest('new spent request description', web3.utils.toWei('5', 'ether'), accounts[2])
        .send({ from: accounts[0], gas: '1000000' })

      // Contributors can approve Requests
      await campaign.methods.approveRequest(0).send({ from: accounts[1], gas: '1000000' })

      // Manager can finalize a request
      await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' })

      let weiBalance = await web3.eth.getBalance(accounts[2])
      ethBalance = web3.utils.fromWei(weiBalance, 'ether')
      assert.equal(parseFloat(ethBalance), 105)
    })
  })
})
