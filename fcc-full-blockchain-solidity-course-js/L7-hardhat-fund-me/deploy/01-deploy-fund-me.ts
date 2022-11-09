import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

import verify from "../utils/verify"
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
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args)
  }
}

export default deployFundMe

deployFundMe.tags = ["all", "fundMe"]
