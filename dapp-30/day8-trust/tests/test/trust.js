const Trust = artifacts.require("Trust");

contract("Trust", (accounts) => {
  let trust = null;
  before(async () => {
    trust = await Trust.deployed();
  });
  beforeEach(async () => {
    // new instance of the contract
    trust = await Trust.new(accounts[0], accounts[1], 5, { value: 100 });
  });

  describe("withdraw()", () => {
    it("should withdraw the contract's balance", async () => {
      const beneficiaryBalBefore = web3.utils.toBN(
        await web3.eth.getBalance(accounts[1])
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await trust.withdraw({ from: accounts[0] });

      const beneficiaryBalAfter = web3.utils.toBN(
        await web3.eth.getBalance(accounts[1])
      );
      assert(beneficiaryBalAfter.sub(beneficiaryBalBefore).toNumber() == 100);
    });

    it("should not withdraw if not enough time has passed yet", async () => {
      try {
        await trust.withdraw({ from: accounts[0] });
      } catch (e) {
        assert(e.message.includes("passed yet"));
        return;
      }
      assert(false);
    });

    it("should not withdraw if initiated by anyone other than the trustee", async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await trust.withdraw({ from: accounts[1] });
      } catch (e) {
        assert(e.message.includes("Only the trustee"));
        return;
      }
      assert(false);
    });
  });
});
