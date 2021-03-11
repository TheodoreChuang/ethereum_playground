const Trust = artifacts.require("Trust");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Trust, accounts[1], accounts[2], 60, {
    value: Number.MAX_SAFE_INTEGER,
  });
};
