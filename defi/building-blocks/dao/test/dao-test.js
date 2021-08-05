const { expect } = require("chai");
const { BigNumber: BN } = require("ethers");

const decimals = 10 ** 18;
const tokenUnit = BN.from(decimals.toString(10));
const amount50 = tokenUnit.mul(50);
const amount100 = tokenUnit.mul(100);
const amount150 = amount50.add(amount100);
const amount1000 = tokenUnit.mul(1000);

const PROPOSAL_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
const RANDOM_HASH = "0x178a2411ab6fbc1ba11064408972259c558d0e82fd48b0aba3ad81d14f065e73";

describe("DAO", () => {
  let memberSuper;
  let memberBasic;
  let governanceToken;
  let dao;

  beforeEach(async () => {
    [memberSuper, memberBasic] = await ethers.getSigners();

    const GovernanceToken = await ethers.getContractFactory("MockGovernanceToken");
    governanceToken = await GovernanceToken.deploy();

    const Dao = await ethers.getContractFactory("Dao");
    dao = await Dao.deploy(governanceToken.address);

    await Promise.all([
      governanceToken.faucet(memberSuper.address, tokenUnit.mul(1000)),
      governanceToken.faucet(memberBasic.address, tokenUnit.mul(200)),
    ]);
  });

  describe("init", () => {
    it("should link to governance token", async () => {
      const gToken = await dao.token();

      expect(gToken).to.equal(governanceToken.address);
    });
  });

  describe("deposit()", () => {
    it("should be able to deposit governance tokens to increase my shares and total shares", async () => {
      const iShares = await dao.shares(memberBasic.address);
      await governanceToken.connect(memberBasic).approve(dao.address, amount100);

      await dao.connect(memberBasic).deposit(amount100);

      const fShares = await dao.shares(memberBasic.address);
      expect(fShares.sub(iShares).toString()).to.equal(amount100.toString());
      const tShares = await dao.totalShares();
      expect(tShares).to.equal(amount100.toString());

      const gTk = await governanceToken.balanceOf(memberBasic.address);
      expect(gTk).to.equal(amount100.toString());
    });
  });

  describe("withdraw()", () => {
    beforeEach(async () => {
      await governanceToken.connect(memberBasic).approve(dao.address, amount100);
      await dao.connect(memberBasic).deposit(amount100);
    });

    it("Should be able to withdraw previously deposited tokens", async () => {
      await dao.connect(memberBasic).withdraw(amount50);

      const fShares = await dao.shares(memberBasic.address);
      expect(fShares).to.equal(amount50.toString());
      const tShares = await dao.totalShares();
      expect(tShares).to.equal(amount50.toString());

      const gTk = await governanceToken.balanceOf(memberBasic.address);
      expect(gTk).to.equal(amount150.toString());
    });
    it("Should not be able to withdraw more than previously deposited tokens", async () => {
      try {
        await dao.connect(memberBasic).withdraw(amount150), "afas";
      } catch (e) {
        expect(e.message.includes("you cannot withdraw more other your own shares")).to.equal(true);
        return;
      }
      throw new Error("error in test: should of reverted");
    });
  });

  describe("createProposal()", () => {
    beforeEach(async () => {
      await governanceToken.connect(memberBasic).approve(dao.address, amount100);
      await dao.connect(memberBasic).deposit(amount100);

      await governanceToken.connect(memberSuper).approve(dao.address, amount1000);
      await dao.connect(memberSuper).deposit(amount1000);
    });

    it("Should not be able to create proposal when shares do not meet threshold", async () => {
      try {
        await dao.connect(memberBasic).createProposal(PROPOSAL_HASH);
      } catch (e) {
        expect(e.message.includes("insufficient shares to create a proposal")).to.equal(true);
        return;
      }
      throw new Error("error in test: should of reverted");
    });
    it("Should not be able to create proposal when one already exists", async () => {
      await dao.connect(memberSuper).createProposal(PROPOSAL_HASH);

      try {
        await dao.connect(memberSuper).createProposal(PROPOSAL_HASH);
      } catch (e) {
        expect(e.message.includes("proposal already exists")).to.equal(true);
        return;
      }
      throw new Error("error in test: should of reverted");
    });

    it("Should be able to create a new proposal", async () => {
      await dao.connect(memberSuper).createProposal(PROPOSAL_HASH);

      const [author, hash, _createAt, voteYes, voteNo, status] = await dao.proposals(PROPOSAL_HASH);

      expect(author).to.equal(memberSuper.address);
      expect(hash).to.equal(PROPOSAL_HASH);
      expect(voteYes.toNumber()).to.equal(0);
      expect(voteNo.toNumber()).to.equal(0);
      expect(status).to.equal(0);
    });
  });

  describe("vote()", () => {
    beforeEach(async () => {
      await governanceToken.connect(memberBasic).approve(dao.address, amount100);
      await dao.connect(memberBasic).deposit(amount100);

      await governanceToken.connect(memberSuper).approve(dao.address, amount1000);
      await dao.connect(memberSuper).deposit(amount1000);

      await dao.connect(memberSuper).createProposal(PROPOSAL_HASH);
    });

    it("Should not be able to vote on a proposal that does not exist", async () => {
      try {
        await dao.connect(memberSuper).vote(RANDOM_HASH, 0);
      } catch (e) {
        expect(e.message.includes("proposal not found")).to.equal(true);
        return;
      }
      throw new Error("error in test: should of reverted");
    });
    it("Should not be able to vote on a proposal more than once", async () => {
      await dao.connect(memberBasic).vote(PROPOSAL_HASH, 0);

      try {
        await dao.connect(memberBasic).vote(PROPOSAL_HASH, 0);
      } catch (e) {
        expect(e.message.includes("already voted")).to.equal(true);
        return;
      }
      throw new Error("error in test: should of reverted");
    });
    it("Should not be able to vote on a proposal that is decided", async () => {
      await dao.connect(memberSuper).vote(PROPOSAL_HASH, 0);

      try {
        await dao.connect(memberSuper).vote(PROPOSAL_HASH, 0);
      } catch (e) {
        expect(e.message.includes("consensus has already been reached")).to.equal(true);
        return;
      }
      throw new Error("error in test: should of reverted");
    });

    it("Should be able to vote on a proposal. Quorum not reached so proposal status is still undecided", async () => {
      await dao.connect(memberBasic).vote(PROPOSAL_HASH, 0);

      const [_author, _hash, _createAt, voteYes, voteNo, status] = await dao.proposals(PROPOSAL_HASH);

      expect(voteYes).to.equal(amount100.toString());
      expect(voteNo.toNumber()).to.equal(0);
      expect(status).to.equal(0);
    });
    it("Should be able to vote on a proposal. Quorum reached so proposal status is decided.", async () => {
      await dao.connect(memberSuper).vote(PROPOSAL_HASH, 1);

      const [_author, _hash, _createAt, voteYes, voteNo, status] = await dao.proposals(PROPOSAL_HASH);

      expect(voteYes.toNumber()).to.equal(0);
      expect(voteNo).to.equal(amount1000.toString());
      expect(status).to.equal(2);
    });
  });
});
