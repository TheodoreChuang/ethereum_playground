const { expectRevert, time } = require("@openzeppelin/test-helpers");
const DAO = artifacts.require("DAO");

contract("DAO", accounts => {
  const [investor1, investor2, investor3] = [accounts[1], accounts[2], accounts[3]];

  let dao;
  beforeEach(async () => {
    dao = await DAO.new(2, 2, 50);
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
      await expectRevert(dao.vote(0, { from: investor2 }), "Only investors");
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
    it.skip("should execute proposal", async () => {});

    it.skip("should NOT execute proposal if not enough votes", async () => {});

    it.skip("should NOT execute proposal twice", async () => {});

    it.skip("should NOT execute proposal before end date", async () => {});
  });

  it.skip("should withdraw ether if admin", async () => {});

  it.skip("should NOT withdraw ether if not admin", async () => {});

  it.skip("should NOT withdraw ether if trying to withdraw too much", async () => {});
});
