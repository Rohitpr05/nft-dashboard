const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x27575353C3C274C44b3EA1d504ECF9525327a411";
  const newBaseURI = "http://localhost:3000/api/metadata/";
  
  console.log("Updating contract baseURI to:", newBaseURI);

  const MoodNFT = await ethers.getContractFactory("MoodNFT");
  const contract = MoodNFT.attach(contractAddress);

  const tx = await contract.setBaseURI(newBaseURI);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("BaseURI updated successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});