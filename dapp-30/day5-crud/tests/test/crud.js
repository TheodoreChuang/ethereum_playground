const Crud = artifacts.require("Crud");

contract("Crud", () => {
  let crud = null;
  before(async () => {
    crud = await Crud.deployed();
  });

  it("Should create a new user", async () => {
    const userName = "Frank";
    await crud.userCreate(userName);

    const newUser = await crud.userRead(1);
    assert(newUser[0].toNumber() === 1);
    assert(newUser[1] === userName);
  });

  it("Should update an existing user", async () => {
    const updatedName = "Franky";
    await crud.userUpdate(1, updatedName);

    const newUser = await crud.userRead(1);
    assert(newUser[0].toNumber() === 1);
    assert(newUser[1] === updatedName);
  });

  it("Should NOT update a non-existing user", async () => {
    try {
      await crud.userUpdate(2, "Nilly");
    } catch (e) {
      assert(e.message.includes("User does not exist"));
      return;
    }
    assert(false);
  });

  it("Should destroy an existing user", async () => {
    await crud.userDestroy(1);

    try {
      await crud.userRead(1);
    } catch (e) {
      assert(e.message.includes("User does not exist"));
      return;
    }
    assert(false);
  });

  it("Should NOT destroy a non-existing user", async () => {
    try {
      await crud.userDestroy(999);
    } catch (e) {
      assert(e.message.includes("User does not exist"));
      return;
    }
    assert(false);
  });
});
