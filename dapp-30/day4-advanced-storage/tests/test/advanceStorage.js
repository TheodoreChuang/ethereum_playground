const AdvancedStorage = artifacts.require("AdvancedStorage");

contract("AdvancedStorage", () => {
  let advancedStorage;
  before(async () => {
    advancedStorage = await AdvancedStorage.deployed();
  });

  describe("add()", () => {
    it("should add a new element to the ids array", async () => {
      await advancedStorage.add(10);

      const results = await advancedStorage.ids(0);
      assert(results.toNumber() === 10);
    });
  });

  describe("get()", () => {
    it("should get a new element to the ids array", async () => {
      await advancedStorage.add(20);

      const results = await advancedStorage.get(1);

      assert(results.toNumber() === 20);
    });
  });

  describe("getAll()", () => {
    it("should get the ids array", async () => {
      const rawIds = await advancedStorage.getAll();

      const ids = rawIds.map((id) => id.toNumber());
      assert.deepEqual(ids, [10, 20]);
    });
  });

  describe("length()", () => {
    it("should get the length of the ids array", async () => {
      const length = await advancedStorage.length();

      assert(length.toNumber() === 2);
    });
  });
});
