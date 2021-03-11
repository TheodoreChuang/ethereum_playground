const Trust = artifacts.require("Trust");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Trust, accounts[0], accounts[1], 5, { value: 100 });
};
