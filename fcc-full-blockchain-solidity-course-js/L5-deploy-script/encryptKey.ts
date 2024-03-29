import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

/**
 * Create an encrypted JSON wallet from a private key with a password.
 * The private key can later be decrypted with the same password without the private key being stored anywhere
 */
async function main() {
  console.log(process.env.PRIVATE_KEY)
  console.log(process.env.PRIVATE_KEY_PASSWORD)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!)
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD!,
    process.env.PRIVATE_KEY!
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
