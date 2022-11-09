import { run } from "hardhat"

/**
 * Verify contract on EtherScan
 * @param contractAddress
 * @param args
 */
async function verify(contractAddress: string, args: any[]) {
  console.log("----------------------------------")
  console.log("Verifying contract on EtherScan...")
  try {
    // Run hardhat task
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified")
    } else {
      console.error("Failed to verify contract", e)
    }
  }
}

export default verify
