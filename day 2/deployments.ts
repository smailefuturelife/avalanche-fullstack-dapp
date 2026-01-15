import dotenv from "dotenv";
dotenv.config();

import { viem } from "hardhat";
import Artifact from "../artifacts/contracts/simple-storage.sol/SimpleStorage.json";

export const USER_PRIVATE_KEY = process.env.PRIVATE_KEY || "";

async function main() {
  // Wallet client (signer)
  const [walletClient] = await viem.getWalletClients({
    privateKey: USER_PRIVATE_KEY,
  });

  // Public client (read-only)
  const publicClient = await viem.getPublicClient();

  console.log("Deploying with account:", walletClient.account.address);

  // Deploy contract
  const hash = await walletClient.deployContract({
    abi: Artifact.abi,
    bytecode: Artifact.bytecode as `0x${string}`,
    args: [], // constructor args, kosong karena owner otomatis
  });

  console.log("Deployment tx hash:", hash);

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log("SimpleStorage deployed at:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
