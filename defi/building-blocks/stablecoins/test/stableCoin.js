const { expectRevert } = require("@openzeppelin/test-helpers");

const MockOracle = artifacts.require("MockOracle");
const StableCoin = artifacts.require("StableCoin");

const BN = web3.utils.BN;
const decimals = 10 ** 18;
const decimalsBN = new BN(decimals.toString(10));

const initialTokensBN = new BN(1000000);
const initialSupplyBN = initialTokensBN.mul(decimalsBN);

const ethUSD1000 = new BN(1000).mul(decimalsBN);

contract("StableCoin", accounts => {
  const [lp1, lp2] = accounts;

  let mockOracle;
  let stableCoin;

  beforeEach(async () => {
    mockOracle = await MockOracle.new();
    stableCoin = await StableCoin.new(mockOracle.address);
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

    it("should not allow borrow if amount is less than one token", async () => {
      await expectRevert(
        stableCoin.borrowPosition(decimalsBN.sub(new BN(1)), {
          from: lp1,
          value: web3.utils.toWei("1", "ether"),
        }),
        "amount below minimum"
      );
    });
    it("should not allow borrow if collateral is insufficient", async () => {
      await expectRevert(
        stableCoin.borrowPosition(ethUSD1000, {
          from: lp1,
          value: web3.utils.toWei("0.99"), // $ 1980
        }),
        "insufficient collateral"
      );
    });
    it("should be able to borrow when at least 200% of the value in ETH is deposited", async () => {
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
  });

  //   describe("redeemPosition()", () => {
  //     it("", async () => {});
  //   });

  //   describe("liquidatePosition()", () => {
  //     it("", async () => {});
  //   });
});
