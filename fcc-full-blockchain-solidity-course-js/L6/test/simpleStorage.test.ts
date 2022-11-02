import { expect } from "chai";
import { ethers } from "hardhat";

import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage contract", () => {
  let SimpleStorageFactory: SimpleStorage__factory;
  let simpleStorage: SimpleStorage;

  beforeEach(async () => {
    SimpleStorageFactory = (await ethers.getContractFactory("SimpleStorage")) as SimpleStorage__factory;
    simpleStorage = await SimpleStorageFactory.deploy();
  });

  it("should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();

    expect(currentValue).to.equal("0");
  });

  it("should update when we call store", async () => {
    const expectedValue = 7;
    const trxRes = await simpleStorage.store(expectedValue);

    await trxRes.wait();
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal(expectedValue);
  });
});
