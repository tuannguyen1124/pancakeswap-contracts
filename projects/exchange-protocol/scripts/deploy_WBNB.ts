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

  console.log("Deploying to network:", networkName);

  // Deploy WBNB
  console.log("Deploying WBNB");

  const WBNBFactory = await ethers.getContractFactory("WBNB");

  const WBNB = await WBNBFactory.deploy();

  await WBNB.deployed();

  console.log("WBNB deployed to:", WBNB.address);

  // eslint-disable-next-line eqeqeq
  if (networkName == "localhost" || networkName == "hardhat") return;

  console.log(`2./ Verify contract WBNB`);
  console.log("\n Waiting for 5 block confirmations\n");
  await WBNB.deploymentTransaction().wait(5);

  console.log("\nStart Verify\n");
  await run("verify:verify", {
    address: WBNB.address, 
    contract: "contracts/libraries/WBNB.sol:WBNB",
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
