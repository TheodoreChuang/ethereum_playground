const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

describe("LiquidityPool Contract", () => {
  let trader1;
  let trader2;
  let underlyingToken;
  let governanceToken;
  let liquidityPool;

  beforeEach(async () => {
    [trader1, trader2] = await ethers.getSigners();

    const UnderlyingToken = await ethers.getContractFactory("UnderlyingToken");
    underlyingToken = await UnderlyingToken.deploy();
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    governanceToken = await GovernanceToken.deploy();
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(underlyingToken.address, governanceToken.address);

    await governanceToken.transferOwnership(liquidityPool.address);

    await Promise.all([underlyingToken.faucet(trader1.address, 1000), underlyingToken.faucet(trader2.address, 1000)]);
  });

  describe("deposit()", () => {
    it("Should allow LP make a deposit and receive LP tokens", async () => {
      await underlyingToken.connect(trader1).approve(liquidityPool.address, 100);

      await liquidityPool.connect(trader1).deposit(100);

      const govTkBal = await governanceToken.balanceOf(trader1.address);
      expect(govTkBal.toString()).to.equal("0");

      const lpTkBal = await liquidityPool.balanceOf(trader1.address);
      expect(lpTkBal.toString()).to.equal("100");

      const underlyingTkBal = await underlyingToken.balanceOf(liquidityPool.address);
      expect(underlyingTkBal.toString()).to.equal("100");

      const underlyingTkBalTrader = await underlyingToken.balanceOf(trader1.address);
      expect(underlyingTkBalTrader.toString()).to.equal("900");
    });
    it("Should allow LP to make multiple deposits and receive LP tokens", async () => {
      await underlyingToken.connect(trader1).approve(liquidityPool.address, 200);

      await liquidityPool.connect(trader1).deposit(100);
      await liquidityPool.connect(trader1).deposit(100);

      const govTkBal = await governanceToken.balanceOf(trader1.address);
      expect(govTkBal.toString()).to.equal("100");

      const lpTkBal = await liquidityPool.balanceOf(trader1.address);
      expect(lpTkBal.toString()).to.equal("200");

      const underlyingTkBal = await underlyingToken.balanceOf(liquidityPool.address);
      expect(underlyingTkBal.toString()).to.equal("200");
    });
    it("Should allow multiple LPs to deposit and receive LP tokens", async () => {
      await underlyingToken.connect(trader1).approve(liquidityPool.address, 100);
      await underlyingToken.connect(trader2).approve(liquidityPool.address, 200);

      await liquidityPool.connect(trader1).deposit(100);
      await liquidityPool.connect(trader2).deposit(200);

      const lpTkBal = await liquidityPool.balanceOf(trader1.address);
      expect(lpTkBal.toString()).to.equal("100");
      const lpTkBal2 = await liquidityPool.balanceOf(trader2.address);
      expect(lpTkBal2.toString()).to.equal("200");

      const underlyingTkBal = await underlyingToken.balanceOf(liquidityPool.address);
      expect(underlyingTkBal.toString()).to.equal("300");
    });
  });
  describe("withdraw()", () => {
    beforeEach(async () => {
      await underlyingToken.connect(trader1).approve(liquidityPool.address, 100);

      await liquidityPool.connect(trader1).deposit(100);

      await time.advanceBlock();
      await time.advanceBlock();
      await time.advanceBlock();
    });

    it("Should allow LP to withdraw all provided liquidity", async () => {
      await liquidityPool.connect(trader1).withdraw(100);

      const govTkBal = await governanceToken.balanceOf(trader1.address);
      expect(govTkBal.toString()).to.equal("400");

      const lpTkBal = await liquidityPool.balanceOf(trader1.address);
      expect(lpTkBal.toString()).to.equal("0");

      const underlyingTkBalTrader = await underlyingToken.balanceOf(trader1.address);
      expect(underlyingTkBalTrader.toString()).to.equal("1000");

      const underlyingTkBal = await underlyingToken.balanceOf(liquidityPool.address);
      expect(underlyingTkBal.toString()).to.equal("0");
    });
    it("Should allow LP to withdraw some of the provided liquidity", async () => {
      await liquidityPool.connect(trader1).withdraw(30);

      const govTkBal = await governanceToken.balanceOf(trader1.address);
      expect(govTkBal.toString()).to.equal("400");

      const lpTkBal = await liquidityPool.balanceOf(trader1.address);
      expect(lpTkBal.toString()).to.equal("70");

      const underlyingTkBalTrader = await underlyingToken.balanceOf(trader1.address);
      expect(underlyingTkBalTrader.toString()).to.equal("930");

      const underlyingTkBal = await underlyingToken.balanceOf(liquidityPool.address);
      expect(underlyingTkBal.toString()).to.equal("70");
    });
    it("Should revert if LP tries to withdraw more than their deposits", async () => {
      await expectRevert(liquidityPool.connect(trader1).withdraw(999), "not enough LP tokens");
    });
  });
});
