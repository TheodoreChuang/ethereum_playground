import { ethers } from "ethers";
import { readFileSync } from "fs";

import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0x797A98eE8C26b5F80DCd58cDcc04914491b5F0d8");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // The collection's name, ex. CryptoPunks
      name: "NarutoDAO",
      // A description for the collection.
      description: "Fans of Naruto anime",
      // The image for the collection that will show up on OpenSea.
      image: readFileSync("scripts/assets/naruto.gif"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log("✅ Successfully deployed bundleDrop module, address:", bundleDropModule.address);
    console.log("✅ bundleDrop metadata:", await bundleDropModule.getMetadata());
    // const bundleDropMetadata = {
    //   metadata: {
    //     name: "NarutoDAO",
    //     description: "Fans of Naruto anime",
    //     image: "https://cloudflare-ipfs.com/ipfs/bafkreicuyexvvh4iahcraaviugqmqz7h2k726uol36qzd6c6t52zomjz6a",
    //     primary_sale_recipient_address: "0x0000000000000000000000000000000000000000",
    //     uri: "ipfs://bafkreibxps3fe32f7b4eipbs6jmycyd3v26a5agpqulpvaxgsm3miry54q",
    //   },
    //   address: "0xe8dD5C3e0AdD72C2166399fc3A9b272C20C3DEa4",
    //   type: 11,
    // };
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();
