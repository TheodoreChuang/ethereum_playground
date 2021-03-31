const Escrow = artifacts.require("Escrow");

const assertError = async (promise, error) => {
  try {
    await promise;
  } catch (e) {
    assert(e.message.includes(error));
    return;
  }
  assert(false);
};

contract("Escrow", accounts => {
  const [lawyer, payer, payee] = accounts;

  let escrow = null;
  before(async () => {
    escrow = await Escrow.deployed();
  });

  describe("deposit()", () => {
    it("should not deposit if sender is not the payer", async () => {
      await assertError(escrow.deposit({ from: accounts[5], value: 1 }), "Only the payer can deposit funds");
    });
    it("should not deposit if total value exceeds amount", async () => {
      await assertError(escrow.deposit({ from: payer, value: 999999 }), "Total value exceeds amount");
    });
    it("Payer should be able to deposit", async () => {
      await escrow.deposit({ from: payer, value: 900 });

      const escrowBalance = await web3.eth.getBalance(escrow.address);
      assert(Number(escrowBalance) === 900);
    });
  });

  describe("release()", () => {
    it("should not release funds before full amount has been deposited", async () => {
      await assertError(escrow.release({ from: lawyer }), "Not fully funded yet");
    });
    it("should not release funds if sender is not the lawyer", async () => {
      await assertError(escrow.release({ from: payee }), "Only lawyer can release funds");
    });
    it("should be able to release funds if conditions are met", async () => {
      await escrow.deposit({ from: payer, value: 100 });
      const payeeBalBefore = web3.utils.toBN(await web3.eth.getBalance(payee));

      await escrow.release({ from: lawyer });

      const payeeBalAfter = web3.utils.toBN(await web3.eth.getBalance(payee));
      assert(payeeBalAfter.sub(payeeBalBefore).toNumber() === 1000);
    });
  });
});
