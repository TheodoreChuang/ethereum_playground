import { ethers, network, run } from "hardhat";

/**
 * Deploy SimpleStorage contract
 */
async function main() {
  // Deploy contract
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract at ${simpleStorage.address}`);

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 6 block confirmations...");
    await simpleStorage.deployTransaction.wait(6);

    console.log("Verifiying contract on Etherscan Goerli");
    await verify(simpleStorage.address, []);
  }
}

/**
 * Verify contract on EtherScan
 * @param contractAddress
 * @param args
 */
async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract on EtherScan...");
  try {
    // Run hardhat task
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.error("Failed to verify contract", e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
