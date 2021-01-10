const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", () => {
  it("data should have an initial value", async () => {
    const simpleStorage = await SimpleStorage.deployed();

    const result = await simpleStorage.data();
    assert(result === "initial data");
  });

  describe("get()", () => {
    it("should return the data variable", async () => {
      const simpleStorage = await SimpleStorage.deployed();

      const result = await simpleStorage.get();
      assert(result === "initial data");
    });
  });

  describe("set()", () => {
    it("should update the data variable", async () => {
      const simpleStorage = await SimpleStorage.deployed();
      await simpleStorage.set("some new data");

      const result = await simpleStorage.get();
      assert(result === "some new data");
    });
  });
});
