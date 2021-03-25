const TrustMultiPayout = artifacts.require("TrustMultiPayout");

contract("TrustMultiPayout", (accounts) => {
  const trustee = accounts[0];
  const beneficiary = accounts[1];
  let trustMultiPayout = null;

  beforeEach(async () => {
    trustMultiPayout = await TrustMultiPayout.new(trustee, beneficiary, 2, {
      value: 100,
    });
  });

  describe("withdraw()", () => {
    describe("validations", () => {
      it("should NOT withdraw if too early", async () => {
        try {
          await trustMultiPayout.withdraw({ from: trustee });
        } catch (e) {
          assert(e.message.includes("Required time has not passed yet"));
          return;
        }
        assert(false);
      });
      it("should NOT withdraw if caller is not trustee", async () => {
        try {
          await trustMultiPayout.withdraw({ from: beneficiary });
        } catch (e) {
          assert(
            e.message.includes("Only the trustee can initiate the withdrawal")
          );
          return;
        }
        assert(false);
      });
      it("should NOT withdraw if no outtstanding payouts", async () => {
        await new Promise((resolve) => setTimeout(resolve, 8000));
        await trustMultiPayout.withdraw({ from: trustee });

        try {
          await trustMultiPayout.withdraw({ from: trustee });
        } catch (e) {
          assert(e.message.includes("All payouts have already been withdrawn"));
          return;
        }
        assert(false);
      });
    });

    describe("payouts and intervals logic", () => {
      it("should withdraw a payout at every interval", async () => {
        for (let i = 0; i < 4; i++) {
          const bInitial = web3.utils.toBN(
            await web3.eth.getBalance(beneficiary)
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await trustMultiPayout.withdraw({ from: trustee });

          const bAfter = web3.utils.toBN(
            await web3.eth.getBalance(beneficiary)
          );
          assert(bAfter.sub(bInitial).toNumber() === 25);
        }
      });
      it("should withdraw outstanding payouts if intervals were missed (ex. every other interval)", async () => {
        for (let i = 0; i < 2; i++) {
          const bInitial = web3.utils.toBN(
            await web3.eth.getBalance(beneficiary)
          );
          await new Promise((resolve) => setTimeout(resolve, 4000));

          await trustMultiPayout.withdraw({ from: trustee });

          const bAfter = web3.utils.toBN(
            await web3.eth.getBalance(beneficiary)
          );
          assert(bAfter.sub(bInitial).toNumber() === 50);
        }
      });
    });
  });
});
