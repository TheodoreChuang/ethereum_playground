const Token = artifacts.require('Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', (accounts) => {
  let token

  before(async () => {
    token = await Token.new()
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()

      assert.equal(name, 'DApp Token')
    })
  })
})
