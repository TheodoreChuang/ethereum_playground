const SDK = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  // Replace with your Alchemy API Key.
  apiKey: process.env.ALCHEMY_MAINNET_KEY || "demo",
  // Replace with your network.
  network: SDK.Network.ETH_MAINNET,
};

const alchemy = new SDK.Alchemy(settings);

const queryAddress = "0x74E714dEa4a397686e57fF4Eb3761FA260c3D8eE";

/*//////////////////////////////////////////////////////////////
                               NFT
//////////////////////////////////////////////////////////////*/

// Access the Alchemy NFT API; filter out spam NFTs.
alchemy.nft
  .getNftsForOwner(queryAddress, {
    excludeFilters: [SDK.NftExcludeFilters.SPAM],
  })
  .then(console.log);

// Get how many NFTs an address owns.
// alchemy.nft.getNftsForOwner(queryAddress).then(nfts => {
//   console.log(nfts.totalCount);
// });

// Get all the image urls for all the NFTs an address owns.
// async function getAllNftImageUrlForAddress() {
//   for await (const nft of alchemy.nft.getNftsForOwnerIterator(queryAddress)) {
//     console.log(nft.media);
//   }
// }
// getAllNftImageUrlForAddress();

// getAllOwnersForNftAddress
// Bored Ape Yacht Club contract address.
// const nftAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
// async function getAllOwnersForNftAddress() {
//   for await (const nft of alchemy.nft.getNftsForContractIterator(nftAddress, {
//     // Omit the NFT metadata for smaller payloads.
//     omitMetadata: true,
//   })) {
//     await alchemy.nft
//       .getOwnersForNft(nft.contract.address, nft.tokenId)
//       .then(response => console.log("owners:", response.owners, "tokenId:", nft.tokenId));
//   }
// }
// getAllOwnersForNftAddress();
