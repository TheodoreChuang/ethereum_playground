const { expect, assert } = require("chai");

describe("FlashloanProvider Contract", () => {
  let trader1;
  let mockToken;
  let mockToken2;
  let flashloanProvider;
  let flashloanUser;

  beforeEach(async () => {
    [trader1] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await MockToken.deploy();
    const MockToken2 = await ethers.getContractFactory("MockToken");
    mockToken2 = await MockToken2.deploy();

    const FlashloanProvider = await ethers.getContractFactory("FlashloanProvider");
    flashloanProvider = await FlashloanProvider.deploy([mockToken.address]);

    await mockToken.faucet(flashloanProvider.address, 1000);

    const FlashloanUser = await ethers.getContractFactory("FlashloanUser");
    flashloanUser = await FlashloanUser.deploy();
  });

  describe("constructor()", () => {
    it("deployed with supported tokens", async () => {
      const supportedToken = await flashloanProvider.tokens(mockToken.address);
      expect(supportedToken).to.equal(mockToken.address);
    });
  });

  describe("executeFlashloan()", () => {
    it("should not allow user to borrow tokens that are not supported", async () => {
      try {
        await flashloanUser.startFlashloan(flashloanProvider.address, 0, mockToken2.address);
      } catch (e) {
        expect(e.message.includes("token not supported")).to.equal(true);
        return;
      }
      assert(false);
    });
    it("should not allow user to borrow more than provider balance", async () => {
      try {
        await flashloanUser.startFlashloan(flashloanProvider.address, 1001, mockToken.address);
      } catch (e) {
        expect(e.message.includes("amount too high")).to.equal(true);
        return;
      }
      assert(false);
    });
    it("should allow user to start a flashloan", async () => {
      const ibalance = await mockToken.balanceOf(flashloanProvider.address);

      await flashloanUser.startFlashloan(flashloanProvider.address, 200, mockToken.address);

      const fbalance = await mockToken.balanceOf(flashloanProvider.address);
      expect(ibalance.eq(fbalance)).to.equal(true);
    });
  });
});
