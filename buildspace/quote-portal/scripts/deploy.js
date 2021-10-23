const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const QuotePortal = await hre.ethers.getContractFactory("QuotePortal");
  const quotePortal = await QuotePortal.deploy({
    value: hre.ethers.utils.parseEther("0.0001"),
  });
  await quotePortal.deployed();

  console.log("QuotePortal contracted deployed at: ", quotePortal.address);
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
