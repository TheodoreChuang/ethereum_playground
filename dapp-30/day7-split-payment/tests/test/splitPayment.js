const SplitPayment = artifacts.require("SplitPayment");

contract("SplitPayment", (accounts) => {
  let splitPayment = null;
  before(async () => {
    splitPayment = await SplitPayment.deployed();
  });

  describe("sendPayment()", () => {
    it("Should split payments among the recipients in the same order", async () => {
      const recipients = [accounts[1], accounts[2], accounts[3]];
      const amounts = [40, 20, 30];
      const initialBalances = await Promise.all(
        recipients.map((r) => web3.eth.getBalance(r))
      );

      await splitPayment.sendPayment(recipients, amounts, {
        from: accounts[0],
        value: 90,
      });

      const finalBalances = await Promise.all(
        recipients.map((r) => web3.eth.getBalance(r))
      );
      recipients.forEach((_, i) => {
        const finalBalance = web3.utils.toBN(finalBalances[i]);
        const initialBalance = web3.utils.toBN(initialBalances[i]);
        assert(finalBalance.sub(initialBalance).toNumber() === amounts[i]);
      });
    });

    it("Should throw error if number of recipients and amounts are different", async () => {
      const recipients = [accounts[1], accounts[2], accounts[3]];
      const amounts = [40, 20];

      try {
        await splitPayment.sendPayment(recipients, amounts, {
          from: accounts[0],
          value: 90,
        });
      } catch (e) {
        assert(
          e.message.includes("Number of recipients and amounts must match")
        );
        return;
      }
      assert(false);
    });
    it("Should throw error if caller is not the owner", async () => {
      const recipients = [accounts[1]];
      const amounts = [9000];
      await splitPayment.sendPayment([], [], {
        from: accounts[0],
        value: 10000,
      });

      try {
        await splitPayment.sendPayment(recipients, amounts, {
          from: accounts[1],
        });
      } catch (e) {
        assert(e.message.includes("Only the owner can execute this action"));
        return;
      }
      assert(false);
    });
  });

  describe("withdrawn()", () => {
    it("Should allow owner to withdrawn from the contract", async () => {
      const initalBalance = await splitPayment.balanceOf();

      await splitPayment.withdraw(8000, { from: accounts[0] });

      const remainingBalance = await splitPayment.balanceOf();
      assert(initalBalance.sub(remainingBalance).toNumber() === 8000);
    });
  });
});
