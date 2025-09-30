const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoodNFT", function () {
  let moodNFT;
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const MoodNFT = await ethers.getContractFactory("MoodNFT");
    moodNFT = await MoodNFT.deploy("https://test-api.com/metadata/");
    await moodNFT.deployed();
  });

  it("Should mint a token successfully", async function () {
    const tx = await moodNFT.mintMoodNFT(addr1.address);
    await tx.wait();

    expect(await moodNFT.ownerOf(1)).to.equal(addr1.address);
    expect(await moodNFT.totalSupply()).to.equal(1);
  });

  it("Should return correct tokenURI", async function () {
    await moodNFT.mintMoodNFT(addr1.address);
    
    const tokenURI = await moodNFT.tokenURI(1);
    expect(tokenURI).to.equal("https://test-api.com/metadata/1");
  });
});