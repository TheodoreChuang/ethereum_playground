const MockOracle = artifacts.require("MockOracle.sol");
const StableCoin = artifacts.require("StableCoin.sol");

module.exports = async (deployer, _network, addresses) => {
  const [oracle] = addresses;

  await deployer.deploy(MockOracle, oracle);
  const mockOracle = await MockOracle.deployed();

  await deployer.deploy(StableCoin, mockOracle.address);
};
