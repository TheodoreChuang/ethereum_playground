import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import { networkConfig } from "../helper-hardhat-config"

const deployFundMe: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let ethUsdPriceFeedAddress: string
  if (chainId === 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!
  }

  log("----------------------------------")
  log(`Deploying FundMe to ${network.name} and waitng for confirmations`)
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  })
}

export default deployFundMe

deployFundMe.tags = ["all", "fundMe"]
