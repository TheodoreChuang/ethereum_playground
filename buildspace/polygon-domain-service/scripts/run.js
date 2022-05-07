const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainsContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainsContractFactory.deploy();
  await domainContract.deployed();
  console.log(`Domains contract deployed at: ${domainContract.address}`);
  console.log(`Domains contract deployed by: ${owner.address}`);

  /**
   * Manual Tests
   */
  const dName = "future_classic";
  const txn = await domainContract.register(dName);
  await txn.wait();

  const domainOwner = await domainContract.getAddress(dName);
  console.log(`Owner of ${dName} is ${domainOwner}`);

  // Trying to set a record that doesn't belong to me!
  txn = await domainContract.connect(randomPerson).setRecord(dName, "Haha my domain now!");
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
