const { expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { BigNumber: BN } = require("ethers");

const decimals = 10 ** 18;
const tokenUnit = BN.from(decimals.toString(10));
const amount50 = tokenUnit.mul(50);
const amount100 = tokenUnit.mul(100);
const amount150 = amount50.add(amount100);

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
      assert(false);
    });
  });
});
