const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MoodNFT contract...");

  // Get the base URI from environment or use default
  const baseURI = process.env.NEXT_PUBLIC_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/metadata/`
    : "https://your-app.vercel.app/api/metadata/";

  console.log("Base URI:", baseURI);

  const MoodNFT = await ethers.getContractFactory("MoodNFT");
  const moodNFT = await MoodNFT.deploy(baseURI);

  await moodNFT.deployed();

  console.log("MoodNFT deployed to:", moodNFT.address);
  console.log("Base URI set to:", baseURI);

  // Save the contract address
  const fs = require('fs');
  const contractAddress = {
    address: moodNFT.address,
    network: network.name
  };

  fs.writeFileSync(
    '../frontend/contract-address.json',
    JSON.stringify(contractAddress, null, 2)
  );

  console.log("Contract address saved to frontend/contract-address.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});