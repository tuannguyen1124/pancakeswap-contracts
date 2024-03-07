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

  // Deploy PancakeFactory
  console.log("Deploying Pancake Factory...");

  const Factory = await ethers.getContractFactory("PancakeFactory");

  const PancakeFactory = await Factory.deploy(
    config.feeToSetter[networkName]
  );

  await PancakeFactory.deployed();

  console.log("Pancake Factory deployed to:", PancakeFactory.address);

  if (networkName === "localhost" || networkName === "hardhat") return;

  console.log(`2./ Verify contract PancakeFactory`);
  console.log("\n Waiting for 5 block confirmations\n");
  await PancakeFactory.deployTransaction.wait(5);

  console.log("\nStart Verify\n");
  await run("verify:verify", {
    address: PancakeFactory.address, 
    contract: "contracts/PancakeFactory.sol:PancakeFactory",
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
