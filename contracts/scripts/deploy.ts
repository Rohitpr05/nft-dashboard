import { ethers } from "hardhat";

async function main() {
  const baseURI = "https://your-api-url.com/metadata/"; // Replace with your actual API URL
  
  console.log("Deploying MoodNFT contract...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const MoodNFT = await ethers.getContractFactory("MoodNFT");
  const moodNFT = await MoodNFT.deploy(baseURI);
  
  await moodNFT.waitForDeployment();
  
  const address = await moodNFT.getAddress();
  
  console.log(`✅ MoodNFT deployed to: ${address}`);
  console.log(`Base URI: ${baseURI}`);
  console.log(`\nVerify with: npx hardhat verify --network sepolia ${address} "${baseURI}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });