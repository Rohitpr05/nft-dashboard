const hre = require("hardhat");

async function main() {
  const baseURI = "https://your-api-url.com/metadata/";
  
  console.log("Deploying MoodNFT contract...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const MoodNFT = await hre.ethers.getContractFactory("MoodNFT");
  const moodNFT = await MoodNFT.deploy(baseURI);
  
  await moodNFT.waitForDeployment();
  
  const address = await moodNFT.getAddress();
  
  console.log(`MoodNFT deployed to: ${address}`);
  console.log(`Base URI: ${baseURI}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });