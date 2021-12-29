import sdk from "./1-initialize-sdk.js";

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule("0x797A98eE8C26b5F80DCd58cDcc04914491b5F0d8");

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: "NarutoDAO Governance Token",
      // What's your token's symbol? Ex. "ETH"
      symbol: "CHAKRA",
    });
    console.log("✅ Successfully deployed token module, address:", tokenModule.address);
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
