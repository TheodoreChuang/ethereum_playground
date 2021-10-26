const main = async () => {
  const NftContract = await hre.ethers.getContractFactory("EpicNFT");
  const nftContract = await NftContract.deploy();
  await nftContract.deployed();
  console.log("nftContract contract deployed to: ", nftContract.address);

  // Mint a NFT
  const mint0 = await nftContract.makeAnEpicNft();
  await mint0.wait();

  // Mint a NFT
  const mint1 = await nftContract.makeAnEpicNft();
  await mint1.wait();
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
