import { ethers, getNamedAccounts, network } from "hardhat"
import { Address } from "hardhat-deploy/types"
import { assert } from "chai"

import { developmentChains } from "../../helper-hardhat-config"
import { FundMe } from "../../typechain-types"

const SEND_VALUE = ethers.utils.parseEther("0.05")

// Run if not local
developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe-Staging", async () => {
      let deployer: Address
      let fundMe: FundMe

      beforeEach(async () => {
        // Required contracts have already been deployed with hardhat-deploy
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      describe("e2e flow", () => {
        it("allows people to fund and withdraw", async () => {
          await fundMe.fund({ value: SEND_VALUE })
          await fundMe.withdraw({ gasLimit: 100000 })

          const endingFundMeBal = await fundMe.provider.getBalance(
            fundMe.address
          )
          assert.equal(endingFundMeBal.toString(), "0")
        })
      })
    })
