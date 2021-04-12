const { expectRevert } = require("@openzeppelin/test-helpers");
const Multisig = artifacts.require("Multisig");

contract("Multisig", accounts => {
  let multisig = null;
  before(async () => {
    multisig = await Multisig.deployed();
  });

  describe("createTransfer()", () => {
    it("should create transfer", async () => {
      await multisig.createTransfer(100, accounts[5], { from: accounts[0] });

      const transfer = await multisig.transfers(0);
      assert(transfer.id.toNumber() === 0);
      assert(transfer.amount.toNumber() === 100);
    });
    it("should not create transfer if sender is not an approver", async () => {
      await expectRevert(multisig.createTransfer(100, accounts[5], { from: accounts[5] }), "Only approver allowed");
    });
  });

  describe("sendTransfer()", () => {
    it("should not send transfer if sender is not an approver", async () => {
      await expectRevert(multisig.sendTransfer(0, { from: accounts[5] }), "Only approver allowed");
    });
    it("should not send transfer if quorum not met", async () => {
      const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
      await multisig.createTransfer(100, accounts[5], { from: accounts[0] });

      await multisig.sendTransfer(1, { from: accounts[0] });

      const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
      assert(balanceAfter.sub(balanceBefore).isZero());
    });
    it("should send transfer if quorum is met", async () => {
      const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
      await multisig.createTransfer(100, accounts[5], { from: accounts[0] });

      await multisig.sendTransfer(2, { from: accounts[0] });
      await multisig.sendTransfer(2, { from: accounts[0] });
      await multisig.sendTransfer(2, { from: accounts[1] });

      const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
      assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
    });
    it("should not send transfer if already sent", async () => {
      const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));

      expectRevert(multisig.sendTransfer(2, { from: accounts[2] }), "Transfer has already been sent");

      const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
      assert(balanceAfter.sub(balanceBefore).isZero());
    });
  });
});
