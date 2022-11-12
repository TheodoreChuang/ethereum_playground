import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { Address } from "hardhat-deploy/types"
import { assert, expect } from "chai"

import { FundMe, MockV3Aggregator } from "../../typechain-types"

const SEND_VALUE = ethers.utils.parseEther("1")

describe("FundMe", async () => {
  let deployer: Address
  let fundMe: FundMe
  let mockV3Aggregator: MockV3Aggregator

  beforeEach(async () => {
    // Deploy all contracts with hardhat-deploy
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    fundMe = await ethers.getContract("FundMe", deployer)
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })

  describe("constructor", () => {
    it("should set aggregator address correctly", async () => {
      const response = await fundMe.s_priceFeed()
      assert.equal(response, mockV3Aggregator.address)
    })
  })

  describe("fund", () => {
    it("should fail if not enough ETH sent", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "FundMe__InsufficientAmount(0)"
      )
    })

    it("should capture the amount contributed by donor", async () => {
      await fundMe.fund({ from: deployer, value: SEND_VALUE })

      const amount = await fundMe.s_addressToAmountFunded(deployer)
      assert.equal(amount.toString(), SEND_VALUE.toString())
    })

    it("should add donor to funders", async () => {
      await fundMe.fund({ from: deployer, value: SEND_VALUE })

      const funder = await fundMe.s_funders(0)
      assert.equal(funder, deployer)
    })
  })

  describe("withdraw", () => {
    beforeEach(async () => {
      await fundMe.fund({ from: deployer, value: SEND_VALUE })
    })

    it("should allow owner to withdraw all funds (single) to their address", async () => {
      const startingFundMeBal = await ethers.provider.getBalance(fundMe.address)
      const startingDeployerBal = await ethers.provider.getBalance(deployer)

      const txResponse = await fundMe.withdraw()
      const txReceipt = await txResponse.wait(1)
      const { effectiveGasPrice, gasUsed } = txReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)

      const endingFundMeBal = await ethers.provider.getBalance(fundMe.address)
      const endingDeployerBal = await ethers.provider.getBalance(deployer)

      assert.equal(endingFundMeBal.toString(), "0")
      assert.equal(
        startingFundMeBal.add(startingDeployerBal).toString(),
        endingDeployerBal.add(gasCost).toString()
      )
    })

    it("should allow owner to withdraw all funds (multiple) to their address", async () => {
      const accounts = await ethers.getSigners()
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i])
        await fundMeConnectedContract.fund({ value: SEND_VALUE })
      }

      const startingFundMeBal = await ethers.provider.getBalance(fundMe.address)
      const startingDeployerBal = await ethers.provider.getBalance(deployer)

      const txResponse = await fundMe.withdraw()
      const txReceipt = await txResponse.wait(1)
      const { effectiveGasPrice, gasUsed } = txReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)

      const endingFundMeBal = await ethers.provider.getBalance(fundMe.address)
      const endingDeployerBal = await ethers.provider.getBalance(deployer)

      assert.equal(endingFundMeBal.toString(), "0")
      assert.equal(
        startingFundMeBal.add(startingDeployerBal).toString(),
        endingDeployerBal.add(gasCost).toString()
      )
    })

    it("should reset funders' funded amounts to zero", async () => {
      const accounts = await ethers.getSigners()
      for (let i = 1; i < 3; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i])
        await fundMeConnectedContract.fund({ value: SEND_VALUE })
      }

      const txResponse = await fundMe.withdraw()
      await txResponse.wait(1)

      for (let i = 1; i < 3; i++) {
        assert.equal(
          await (
            await fundMe.s_addressToAmountFunded(accounts[i].address)
          ).toString(),
          "0"
        )
      }
    })

    it("should reset funders to empty array", async () => {
      const txResponse = await fundMe.withdraw()
      await txResponse.wait(1)

      await expect(fundMe.s_funders(0)).to.be.reverted
    })

    it("should revert if non-owner attempts to withdraw", async () => {
      const [, notOwner] = await ethers.getSigners()

      await expect(fundMe.connect(notOwner).withdraw()).to.be.revertedWith(
        "FundMe__OnlyOwner()"
      )
    })
  })
})
