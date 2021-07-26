const { expect } = require("chai");

describe("GovernanceToken", () => {
  let owner;
  let addr1;
  let governanceToken;

  beforeEach(async () => {
    const [_owner, _addr1] = await ethers.getSigners();
    owner = _owner;
    addr1 = _addr1;

    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    governanceToken = await GovernanceToken.deploy();
  });

  it("Should have zero initial supply", async () => {
    const iTotalSupply = await governanceToken.totalSupply();
    expect(iTotalSupply.toString()).to.equal("0");
  });
  it("Should allow the owner of the contract to mint", async () => {
    await governanceToken.mint(addr1.address, 9999);

    const fTotalSupply = await governanceToken.totalSupply();
    expect(fTotalSupply.toString()).to.equal("9999");
  });

  it("Should not allow any address other than the owner to mint", async () => {
    await expect(governanceToken.connect(addr1).mint(addr1.address, 9999)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    const fTotalSupply = await governanceToken.totalSupply();
    expect(fTotalSupply.toString()).to.equal("0");
  });
});
