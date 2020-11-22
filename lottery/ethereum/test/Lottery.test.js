const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("lottery", () => {
  it("contract deploys and has an address", () => {
    assert.ok(lottery.options.address);
  });

  describe("entering a contract", () => {
    it("allows one account to enter", async () => {
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });

      const players = await lottery.methods
        .getPlayers()
        .call({ from: accounts[0] });
      assert.equal(accounts[0], players[0]);
      assert.equal(1, players.length);
    });

    it("allows multiple accounts to enter", async () => {
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.05", "ether") });
      await lottery.methods
        .enter()
        .send({ from: accounts[2], value: web3.utils.toWei("0.1", "ether") });

      const players = await lottery.methods
        .getPlayers()
        .call({ from: accounts[0] });
      assert.equal(accounts[0], players[0]);
      assert.equal(accounts[0], players[1]);
      assert.equal(accounts[2], players[2]);
      assert.equal(3, players.length);
    });

    it("throws an error if the minimum value is not included", async () => {
      try {
        await lottery.methods.enter.send({ from: accounts[0], value: 1 });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });
  });

  describe("picking a winner", () => {
    it("only the manager can call pick a winner", async () => {
      try {
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });

    it("sends contract's balance to winner and resets players array", async () => {
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });
      const initialBalance = await web3.eth.getBalance(accounts[0]);

      await lottery.methods.pickWinner().send({ from: accounts[0] });
      const finalBalance = await web3.eth.getBalance(accounts[0]);

      const difference = finalBalance - initialBalance;
      assert(difference > web3.utils.toWei("1.9", "ether")); // prize deduct ~gas costs
      const players = await lottery.methods
        .getPlayers()
        .call({ from: accounts[0] });
      assert.equal(0, players.length);
    });
  });
});
