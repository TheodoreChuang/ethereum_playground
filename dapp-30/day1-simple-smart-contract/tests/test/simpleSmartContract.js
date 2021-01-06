const SimpleSmartContract = artifacts.require("SimpleSmartContract");

contract("SimpleSmartContract", () => {
  it("should deploy smart contract", async () => {
    const simpleSmartContract = await SimpleSmartContract.deployed();

    assert(simpleSmartContract !== "");
  });
});
