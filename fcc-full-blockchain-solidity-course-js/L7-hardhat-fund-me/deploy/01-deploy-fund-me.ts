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

  let ethUsdPriceFeedAddress: string

  // TODO - for local development need to mock price oracle
  ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!

  console.log(
    `Deploying FundMe to ${network.name} and waitng for confirmations`
  )
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  })
}

export default deployFundMe
