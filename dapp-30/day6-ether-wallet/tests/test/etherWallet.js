const EtherWallet = artifacts.require("EtherWallet");

contract("EtherWallet", (accounts) => {
  const balanceAmount = 100;
  let etherWallet = null;
  before(async () => {
    etherWallet = await EtherWallet.deployed();
  });

  describe("Contract Init", () => {
    it("Should set accounts[0] as owner", async () => {
      const owner = await etherWallet.owner();

      assert(owner === accounts[0]);
    });
  });

  describe("deposit()", () => {
    it("Should deposit Wei to etherWallet", async () => {
      await etherWallet.deposit({
        from: accounts[0],
        value: balanceAmount,
      });

      const balance = await web3.eth.getBalance(etherWallet.address);
      assert(Number(balance) === balanceAmount);
    });
  });

  describe("balanceOf()", () => {
    it("Should return the balance of the contract", async () => {
      const balance = await etherWallet.balanceOf();

      assert(Number(balance) === balanceAmount);
    });
  });

  describe("send()", () => {
    it("Should transfer Wei to another address", async () => {
      const recipientBalanceBefore = await web3.eth.getBalance(accounts[1]);
      const initialBalance = web3.utils.toBN(recipientBalanceBefore);

      await etherWallet.send(accounts[1], 50, { from: accounts[0] });

      const recipientBalanceAfter = await web3.eth.getBalance(accounts[1]);
      const finalBalance = web3.utils.toBN(recipientBalanceAfter);
      assert(finalBalance.sub(initialBalance).toNumber() === 50);
    });
    it("Should not transfer Wei if sender is not the owner", async () => {
      try {
        await etherWallet.send(accounts[3], 50, { from: accounts[3] });
      } catch (e) {
        assert(e.message.includes("Only the owner can send funds"));
        return;
      }
      assert(false);
    });
  });
});
