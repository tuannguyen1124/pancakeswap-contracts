import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  const networkName = network.name;

  // Sanity checks
  if (networkName === "mainnet") {
    if (!process.env.KEY_MAINNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  } else if (networkName === "testnet") {
    if (!process.env.KEY_TESTNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  }

//   if (!config.PancakeRouter[networkName] || config.PancakeRouter[networkName] === ethers.constants.AddressZero) {
//     throw new Error("Missing router address, refer to README 'Deployment' section");
//   }

//   if (!config.WBNB[networkName] || config.WBNB[networkName] === ethers.constants.AddressZero) {
//     throw new Error("Missing WBNB address, refer to README 'Deployment' section");
//   }

  console.log("Deploying to network:", networkName);

  // Deploy PancakeZapV1
  console.log("Deploying Pancake Router 01...");

  const PKRouter01 = await ethers.getContractFactory("PancakeRouter01");

  const PancakeRouter01 = await PKRouter01.deploy(
    config.PancakeFactory[networkName],
    config.WBNB[networkName]
  );

  await PancakeRouter01.deployed();

  console.log("Pancake Factory deployed to:", PancakeRouter01.address);

  if (networkName === "localhost" || networkName === "hardhat") return;

  console.log(`2./ Verify contract Pancake Router 01`);
  console.log("\n Waiting for 5 block confirmations\n");
  await PancakeRouter01.deployTransaction.wait(5);

  console.log("\nStart Verify\n");
  await run("verify:verify", {
    address: PancakeRouter01.address, 
    contract: "contracts/PancakeRouter01.sol:PancakeRouter01",
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
