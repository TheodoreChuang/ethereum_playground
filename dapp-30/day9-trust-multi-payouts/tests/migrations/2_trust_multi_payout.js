const TrustMultiPayout = artifacts.require("TrustMultiPayout");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(TrustMultiPayout, accounts[0], accounts[1], 1, {
    value: 100,
  });
};
