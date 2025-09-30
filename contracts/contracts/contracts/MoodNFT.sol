// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MoodNFT
 * @dev Dynamic NFT that changes based on external data
 * Metadata is served dynamically by our API
 */
contract MoodNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    
    // Base URI for metadata API
    string private _baseTokenURI;
    
    event MoodNFTMinted(address to, uint256 tokenId);
    
    constructor(string memory baseURI) ERC721("MoodNFT", "MOOD") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Mint a new MoodNFT
     * @param to Address to mint the NFT to
     * @return tokenId The ID of the newly minted token
     */
    function mintMoodNFT(address to) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        
        emit MoodNFTMinted(to, newTokenId);
        
        return newTokenId;
    }
    
    /**
     * @dev Returns the base URI for computing tokenURI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Update the base URI (only owner)
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
    }
    
    /**
     * @dev Get the current token count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
}