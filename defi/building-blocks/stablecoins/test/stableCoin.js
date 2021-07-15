const { expectRevert } = require("@openzeppelin/test-helpers");

const MockOracle = artifacts.require("MockOracle");
const StableCoin = artifacts.require("StableCoin");

const BN = web3.utils.BN;
const decimals = 10 ** 18;
const decimalsBN = new BN(decimals.toString(10));

const initialTokensBN = new BN(1000000);
const initialSupplyBN = initialTokensBN.mul(decimalsBN);

const ethUSD1000 = new BN(1000).mul(decimalsBN);
const ethUSD500 = new BN(500).mul(decimalsBN);
const ethUSD330_2512 = new BN(3302512).mul(decimalsBN.div(new BN(10000)));
const ethUSD669_7488 = ethUSD1000.sub(ethUSD330_2512);

contract("StableCoin", accounts => {
  const [lp1, lp2] = accounts;

  let mockOracle;
  let stableCoin;

  beforeEach(async () => {
    mockOracle = await MockOracle.new();
    stableCoin = await StableCoin.new(mockOracle.address);
  });

  describe("mockOracle interface check", () => {
    it("should have initial ETH price at $2000", async () => {
      const price = await mockOracle.getEtherPrice();

      expect(price.toString()).to.equal("2000");
    });
    it("should be able to update price", async () => {
      const iPrice = await mockOracle.getEtherPrice();
      expect(iPrice.toString()).to.equal("2000");

      await mockOracle.updateEtherPrice(1978);

      const fPrice = await mockOracle.getEtherPrice();
      expect(fPrice.toString()).to.equal("1978");
    });
  });

  describe("deploy initial contract", () => {
    it("should have the expected name and symbol", async () => {
      const name = await stableCoin.name();
      const symbol = await stableCoin.symbol();

      expect(name).to.equal("ETH Backed Token");
      expect(symbol).to.equal("ethUSD");
    });
    it("should have the expected initial and total supply", async () => {
      const supply = await stableCoin.initialSupply();
      const total = await stableCoin.totalSupply();

      expect(supply.eq(initialSupplyBN)).to.equal(true);
      expect(total.eq(initialSupplyBN)).to.equal(true);
    });
  });

  // describe("adjustSupply()", () => {
  //   it("", async () => {
  //   });
  // });

  describe("borrowPosition()", () => {
    beforeEach(async () => {
      const iPosition = await stableCoin.positions(lp1);
      expect(iPosition.collateral.toString()).to.equal("0");
      expect(iPosition.token.toString()).to.equal("0");
    });

    describe("should not allow borrow when", () => {
      it("amount is less than one token", async () => {
        await expectRevert(
          stableCoin.borrowPosition(decimalsBN.sub(new BN(1)), {
            from: lp1,
            value: web3.utils.toWei("1", "ether"),
          }),
          "amount below minimum"
        );
      });
      it("collateral is insufficient", async () => {
        await expectRevert(
          stableCoin.borrowPosition(ethUSD1000, {
            from: lp1,
            value: web3.utils.toWei("0.99"), // $ 1980
          }),
          "insufficient collateral"
        );
      });
    });
    describe("should be able to borrow when", () => {
      it("at least 200% of the value in ETH is deposited", async () => {
        await stableCoin.borrowPosition(ethUSD1000, {
          from: lp1,
          value: web3.utils.toWei("1"), // $ 2000
        });

        const fPosition = await stableCoin.positions(lp1);
        expect(fPosition.collateral.toString()).to.equal("1000000000000000000");
        expect(fPosition.token.toString()).to.equal("1000000000000000000000");

        const total = await stableCoin.totalSupply();
        expect(total.eq(initialSupplyBN.add(fPosition.token))).to.equal(true);
      });
      it("at least 200% of the value in ETH is deposited - multi", async () => {
        await stableCoin.borrowPosition(ethUSD1000, {
          from: lp1,
          value: web3.utils.toWei("1"), // $ 2000
        });

        await stableCoin.borrowPosition(ethUSD1000, {
          from: lp2,
          value: web3.utils.toWei("1"), // $ 2000
        });

        const fPosition = await stableCoin.positions(lp1);
        expect(fPosition.collateral.toString()).to.equal("1000000000000000000");
        expect(fPosition.token.toString()).to.equal("1000000000000000000000");

        const total = await stableCoin.totalSupply();
        expect(total.eq(initialSupplyBN.add(fPosition.token.mul(new BN(2))))).to.equal(true);
      });
    });
  });

  describe("redeemPosition()", () => {
    describe("should not allow redemptions if", () => {
      it("amount is greater than total position", async () => {
        await expectRevert(
          stableCoin.redeemPosition(1, {
            from: lp1,
          }),
          "amount above total position"
        );
      });
      it("overall LTV less than required (after price buffer)", async () => {
        await stableCoin.borrowPosition(ethUSD1000, {
          from: lp1,
          value: web3.utils.toWei("1"), // $ 2000
        });

        await mockOracle.updateEtherPrice(1990);

        await expectRevert(
          stableCoin.redeemPosition(ethUSD1000, {
            from: lp1,
          }),
          "insufficient collateral"
        );
      });
    });

    describe("should allow redemptions if sufficient collateral", () => {
      beforeEach(async () => {
        await stableCoin.borrowPosition(ethUSD1000, {
          from: lp1,
          value: web3.utils.toWei("1"), // $ 2000
        });

        const iPosition = await stableCoin.positions(lp1);
        expect(iPosition.collateral.toString()).to.equal("1000000000000000000");
        expect(iPosition.token.toString()).to.equal("1000000000000000000000");
      });
      it("when partial (50%) redemption", async () => {
        const ethBefore = web3.utils.toBN(await web3.eth.getBalance(lp1));

        await stableCoin.redeemPosition(ethUSD500, {
          from: lp1,
        });

        const fPosition = await stableCoin.positions(lp1);
        expect(fPosition.collateral.toString()).to.equal("500000000000000000");
        expect(fPosition.token.toString()).to.equal("500000000000000000000");

        const ethAfter = web3.utils.toBN(await web3.eth.getBalance(lp1));
        expect(ethAfter.gt(ethBefore)).to.equal(true);
      });
      it("when full redemption", async () => {
        const ethBefore = web3.utils.toBN(await web3.eth.getBalance(lp1));

        await stableCoin.redeemPosition(ethUSD1000, {
          from: lp1,
        });

        const fPosition = await stableCoin.positions(lp1);
        expect(fPosition.collateral.toString()).to.equal("0");
        expect(fPosition.token.toString()).to.equal("0");

        const ethAfter = web3.utils.toBN(await web3.eth.getBalance(lp1));
        expect(ethAfter.gt(ethBefore)).to.equal(true);

        const total = await stableCoin.totalSupply();
        expect(total.eq(initialSupplyBN)).to.equal(true);
      });
      it("when partial (~33%) redemption", async () => {
        await stableCoin.redeemPosition(ethUSD330_2512, {
          from: lp1,
        });

        const fPosition = await stableCoin.positions(lp1);
        expect(fPosition.collateral.toString()).to.equal("666666666666666667");
        expect(fPosition.token.toString()).to.equal("669748800000000000000");
      });
      it("when partial (~33%) and then remaining redemption", async () => {
        const ethBefore = web3.utils.toBN(await web3.eth.getBalance(lp1));

        await stableCoin.redeemPosition(ethUSD330_2512, {
          from: lp1,
        });
        await stableCoin.redeemPosition(ethUSD669_7488, {
          from: lp1,
        });

        const fPosition = await stableCoin.positions(lp1);
        expect(fPosition.collateral.toString()).to.equal("0");
        expect(fPosition.token.toString()).to.equal("0");

        const ethAfter = web3.utils.toBN(await web3.eth.getBalance(lp1));
        expect(ethAfter.gt(ethBefore)).to.equal(true);
        // slightly less than initial 1 ETH due to gas costs
        expect(ethAfter.sub(ethBefore).toString().length).to.equal(18);

        const total = await stableCoin.totalSupply();
        expect(total.eq(initialSupplyBN)).to.equal(true);
      });
    });
  });

  //   describe("liquidatePosition()", () => {
  //     it("", async () => {});
  //   });
});
