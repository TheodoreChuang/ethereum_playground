const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const DAO = artifacts.require("DAO");

contract("DAO", accounts => {
  const [admin, investor1, investor2, investor3] = [accounts[0], accounts[1], accounts[2], accounts[3]];

  let dao;
  beforeEach(async () => {
    dao = await DAO.new(2, 2, 70);
  });

  describe("initial set up", () => {
    it("should set quorum to provided percentage", async () => {
      expect((await dao.quorum()).toNumber()).to.equal(70);
    });
  });

  describe("contribution()", () => {
    it("should accept contribution", async () => {
      expect(await dao.investors(investor1)).to.equal(false);
      expect((await dao.shares(investor1)).toNumber()).to.equal(0);
      expect((await dao.totalShares()).toNumber()).to.equal(0);
      expect((await dao.availableFunds()).toNumber()).to.equal(0);

      await dao.contribute({ from: investor1, value: 50 });
      await dao.contribute({ from: investor2, value: 150 });

      expect(await dao.investors(investor1)).to.equal(true);
      expect((await dao.shares(investor1)).toNumber()).to.equal(50);
      expect((await dao.totalShares()).toNumber()).to.equal(200);
      expect((await dao.availableFunds()).toNumber()).to.equal(200);
    });

    it("should NOT accept contribution after contributionTime", async () => {
      await time.increase(3);

      await expectRevert(dao.contribute({ from: investor1, value: 50 }), "Contribution period has ended");
    });
  });

  describe("createProposal()", () => {
    it("should create proposal", async () => {
      expect((await dao.nextProposalId()).toNumber()).to.equal(0);
      await dao.contribute({ from: investor1, value: 50 });

      await dao.createProposal("C-P1", 10, accounts[5], { from: investor1 });

      expect((await dao.nextProposalId()).toNumber()).to.equal(1);
      const cp1 = await dao.proposals(0);
      expect(cp1.id.toNumber()).to.equal(0);
      expect(cp1.name).to.equal("C-P1");
      expect(cp1.amount.toNumber()).to.equal(10);
      expect(cp1.recipient).to.equal(accounts[5]);
      expect(cp1.votes.toNumber()).to.equal(0);
      expect(cp1.executed).to.equal(false);
    });

    it("should NOT create proposal if not from investor", async () => {
      await expectRevert(dao.createProposal("C-P2", 999, accounts[5], { from: accounts[5] }), "Only investors");
    });

    it("should NOT create proposal if amount too big", async () => {
      await dao.contribute({ from: investor1, value: 50 });

      await expectRevert(dao.createProposal("C-P3", 99, accounts[5], { from: investor1 }), "Not of enough funds");
    });
  });

  describe("vote()", () => {
    beforeEach(async () => {
      await dao.contribute({ from: investor1, value: 50 });
      await dao.createProposal("V-P1", 10, accounts[5], { from: investor1 });
    });

    it("should vote", async () => {
      const vp1a = await dao.proposals(0);
      expect(vp1a.votes.toNumber()).to.equal(0);
      expect(await dao.votes(investor1, 0)).to.equal(false);

      await dao.vote(0, { from: investor1 });

      const vp1b = await dao.proposals(0);
      expect(vp1b.votes.toNumber()).to.equal(50);
      expect(await dao.votes(investor1, 0)).to.equal(true);
    });

    it("should NOT vote if not investor", async () => {
      await expectRevert(dao.vote(0, { from: accounts[5] }), "Only investors");
    });

    it("should NOT vote if already voted", async () => {
      await dao.vote(0, { from: investor1 });

      await expectRevert(dao.vote(0, { from: investor1 }), "Already voted");
    });

    it("should NOT vote if after proposal end date", async () => {
      await time.increase(3);

      await expectRevert(dao.vote(0, { from: investor1 }), "Voting period is over");
    });
  });

  describe("executeProposal()", () => {
    beforeEach(async () => {
      await dao.contribute({ from: investor1, value: 50 });
      await dao.contribute({ from: investor2, value: 150 });
      await dao.createProposal("E-P1", 10, accounts[5], { from: investor1 });
    });

    it("should execute proposal", async () => {
      const ep1a = await dao.proposals(0);
      expect(ep1a.executed).to.equal(false);
      await dao.vote(0, { from: investor2 });
      await time.increase(3);

      await dao.executeProposal(0, { from: admin });

      const ep1b = await dao.proposals(0);
      expect(ep1b.executed).to.equal(true);
    });

    it("should NOT execute proposal if not admin", async () => {
      await expectRevert(dao.executeProposal(0, { from: investor1 }), "Only admin");
    });

    it("should NOT execute proposal if not enough votes", async () => {
      await dao.vote(0, { from: investor1 });
      await time.increase(3);

      await expectRevert(dao.executeProposal(0, { from: admin }), "Quorum not met");
    });

    it("should NOT execute proposal twice", async () => {
      await dao.vote(0, { from: investor2 });
      await time.increase(3);
      await dao.executeProposal(0, { from: admin });

      await expectRevert(dao.executeProposal(0, { from: admin }), "Proposal has already been executed");
    });

    it("should NOT execute proposal before end date", async () => {
      await expectRevert(dao.executeProposal(0, { from: admin }), "Voting is not over yet");
    });
  });

  describe("redeemShare()", () => {
    beforeEach(async () => {
      await dao.contribute({ from: investor1, value: 50 });
    });

    it("should be able to redeem shares back to original Wei amount", async () => {
      // const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(investor1));
      // console.log("🚀 ~ file: dao.js ~ line 155 ~ it ~ balanceBefore", balanceBefore.toString());

      await dao.redeemShare(20, { from: investor1 });

      expect((await dao.shares(investor1)).toNumber()).to.equal(30);
      expect((await dao.totalShares()).toNumber()).to.equal(30);
      expect((await dao.availableFunds()).toNumber()).to.equal(30);
      // const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(investor1));
      // console.log("🚀 ~ file: dao.js ~ line 155 ~ it ~ balanceAfter", balanceAfter.toString());
      // expect(balanceAfter.sub(balanceBefore).toNumber()).to.equal(20);
      // expect(balanceAfter.gt(balanceBefore)).to.equal(true);
    });

    it("should NOT be able to redeem more than their own shares", async () => {
      await expectRevert(dao.redeemShare(1, { from: admin }), "You do not have enough shares");
    });

    it("should NOT be able to redeem if DAO has insufficient funds", async () => {
      await dao.createProposal("R-P1", 40, accounts[5], { from: investor1 });

      await expectRevert(dao.redeemShare(11, { from: investor1 }), "DAO does not enough funds");
    });
  });

  describe("transferShare()", () => {
    const newInvestor = accounts[9];

    beforeEach(async () => {
      await dao.contribute({ from: investor1, value: 50 });
    });

    afterEach(async () => {
      expect((await dao.totalShares()).toNumber()).to.equal(50);
      expect((await dao.availableFunds()).toNumber()).to.equal(50);
    });

    it("should be able to transfer own shares", async () => {
      expect((await dao.shares(newInvestor)).toNumber()).to.equal(0);
      expect(await dao.investors(newInvestor)).to.equal(false);

      await dao.transferShare(15, newInvestor, { from: investor1 });

      expect((await dao.shares(newInvestor)).toNumber()).to.equal(15);
      expect((await dao.shares(investor1)).toNumber()).to.equal(35);
      expect(await dao.investors(newInvestor)).to.equal(true);
    });

    it("should NOT be able to transfer more than their own shares", async () => {
      await expectRevert(dao.transferShare(1, newInvestor, { from: admin }), "You do not have enough shares");
    });
  });

  describe("withdrawEth()", () => {
    beforeEach(async () => {
      await dao.contribute({ from: investor1, value: 100 });
    });

    it("should withdraw ether if admin", async () => {
      await dao.withdrawEth(accounts[6], 100, { from: admin });
    });

    it("should NOT withdraw ether if not admin", async () => {
      await expectRevert(dao.withdrawEth(accounts[7], 100, { from: accounts[7] }), "Only admin");
    });

    it("should NOT withdraw ether if trying to withdraw too much", async () => {
      await expectRevert(dao.withdrawEth(accounts[6], 999, { from: admin }), "Not enough available funds");
    });
  });
});
