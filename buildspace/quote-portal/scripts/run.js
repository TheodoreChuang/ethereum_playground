const main = async () => {
  const [owner, acct1] = await hre.ethers.getSigners();
  const quoteContractFactory = await hre.ethers.getContractFactory("QuotePortal");
  const quoteContract = await quoteContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.0001"),
  });
  await quoteContract.deployed();
  console.log("QuotePortal contracted deployed at: ", quoteContract.address);
  console.log("owner address: ", owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(quoteContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

  await quoteContract.getTotalQuotes();

  const quoteTxn1 = await quoteContract.quote("quote 1: lorem");
  await quoteTxn1.wait();

  contractBalance = await hre.ethers.provider.getBalance(quoteContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));
  await quoteContract.getTotalQuotes();

  const quoteTxn2 = await quoteContract.connect(acct1).quote("quote 2: ipsum");
  await quoteTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(quoteContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));
  await quoteContract.getTotalQuotes();

  const allQuotes = await quoteContract.getAllQuotes();
  console.log("AllQuotes", allQuotes);

  const quoteTxn2a = await quoteContract.connect(acct1).quote("quote 2b: attempted quote");
  await quoteTxn2a.wait();
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
