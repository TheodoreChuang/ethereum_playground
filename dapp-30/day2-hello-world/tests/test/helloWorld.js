const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", () => {
  describe("hello()", () => {
    it('should return "Hellow World"', async () => {
      const helloWorld = await HelloWorld.deployed();
      const result = await helloWorld.hello();

      assert(result === "Hello World");
    });
  });
});
