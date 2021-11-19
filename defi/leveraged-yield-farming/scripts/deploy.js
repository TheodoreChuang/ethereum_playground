async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const YieldFarmer = await ethers.getContractFactory("YieldFarmer");
  const yieldFarmer = await YieldFarmer.deploy(
    "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b" // comptroller
  );
  await yieldFarmer.deployed();

  console.log("YieldFarmer address:", yieldFarmer.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
