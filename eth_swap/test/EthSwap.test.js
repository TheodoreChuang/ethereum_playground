const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', (accounts) => {
  const [deployer, investor] = accounts
  let token
  let ethSwap

  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    await token.transfer(ethSwap.address, tokens('1000000'))
  })

  describe('EthSwap deployment', () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()

      assert.equal(name, 'EthSwap Instant Exchange')
    })

    it('contract has tokens', async () => {
      const tokenBalance = await token.balanceOf(ethSwap.address)
      const ethBalance = await web3.eth.getBalance(ethSwap.address)

      assert.equal(tokenBalance.toString(), tokens('1000000'))
      assert.equal(ethBalance.toString(), '0')
    })
  })

  describe('buyTokens()', () => {
    it('Allows users to instantly purchase tokens with ETH from ethSwap at a fixed rate', async () => {
      const investorTokenBalanceInitial = await token.balanceOf(investor)
      assert.equal(investorTokenBalanceInitial.toString(), tokens('0'))

      const result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') })

      const investorTokenBalanceAfter = await token.balanceOf(investor)
      assert.equal(investorTokenBalanceAfter.toString(), tokens('100'))

      const ethSwapTokenBalanceAfter = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapTokenBalanceAfter.toString(), tokens('999900'))
      const ethSwapEthBalanceAfter = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapEthBalanceAfter.toString(), web3.utils.toWei('1', 'ether'))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })
  })

  describe('sellTokens()', () => {
    it('Allows users to instantly sell tokens for ETH from ethSwap at a fixed rate', async () => {
      const investorTokenBalanceInitial = await token.balanceOf(investor)
      assert.equal(investorTokenBalanceInitial.toString(), tokens('100'))

      // Investor first must give EthSwap approval to make a transfer on its behalf (Investor's tokens to EthSwap)
      await token.approve(ethSwap.address, tokens('100'), { from: investor })
      // then Investor sells tokens
      const result = await ethSwap.sellTokens(tokens('100'), { from: investor })

      const investorTokenBalanceAfter = await token.balanceOf(investor)
      assert.equal(investorTokenBalanceAfter.toString(), tokens('0'))

      const ethSwapTokenBalanceAfter = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapTokenBalanceAfter.toString(), tokens('1000000'))
      const ethSwapEthBalanceAfter = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapEthBalanceAfter.toString(), web3.utils.toWei('0', 'ether'))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })

    it('Should reject an attempt to sell more tokens than the Investor owns', async () => {
      await ethSwap.sellTokens(tokens('999'), { from: investor }).should.be.rejected
    })
  })
})
