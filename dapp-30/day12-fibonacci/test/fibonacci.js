const Fibonacci = artifacts.require("Fibonacci");

contract("Fibonacci", () => {
  let fibonacci = null;
  before(async () => {
    fibonacci = await Fibonacci.deployed();
  });

  it("should calculate fibonacci value where n is 0", async () => {
    const result = await fibonacci.fib(0);
    assert(result.toNumber() === 0);
  });
  it("should calculate fibonacci value where n is 1", async () => {
    const result = await fibonacci.fib(1);
    assert(result.toNumber() === 1);
  });
  it("should calculate fibonacci value where n is 2", async () => {
    const result = await fibonacci.fib(2);
    assert(result.toNumber() === 1);
  });
  it("should calculate fibonacci value where n is 3", async () => {
    const result = await fibonacci.fib(3);
    assert(result.toNumber() === 2);
  });
  it("should calculate fibonacci value where n is 4", async () => {
    const result = await fibonacci.fib(4);
    assert(result.toNumber() === 3);
  });
  it("should calculate fibonacci value where n is 10", async () => {
    const result = await fibonacci.fib(10);
    assert(result.toNumber() === 55);
  });
});
