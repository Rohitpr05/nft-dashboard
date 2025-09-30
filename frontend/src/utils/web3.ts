import { ethers } from 'ethers';
import MoodNFTABI from '../contracts/MoodNFTABI.json';
import contractData from '../contract-address.json';

// Contract configuration
export const CONTRACT_ADDRESS = contractData.address;
export const CONTRACT_NETWORK = contractData.network;

/**
 * Get an ethers provider
 */
export const getProvider = () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  return new ethers.providers.Web3Provider(window.ethereum);
};

/**
 * Get signer from connected account
 */
export const getSigner = async () => {
  const provider = getProvider();
  // Trigger the connection popup
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
};

/**
 * Get contract instance
 */
export const getContract = async (withSigner = true) => {
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, MoodNFTABI, signer);
  } else {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESS, MoodNFTABI, provider);
  }
};

/**
 * Get ETH balance of an address
 */
export const getETHBalance = async (address) => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

/**
 * Get network details
 */
export const getNetworkDetails = async () => {
  const provider = getProvider();
  return await provider.getNetwork();
};

/**
 * Check if user is connected to the correct network
 */
export const checkNetwork = async () => {
  const network = await getNetworkDetails();
  
  // Sepolia testnet chainId is 11155111
  if (CONTRACT_NETWORK === 'sepolia' && network.chainId !== 11155111) {
    return {
      isCorrectNetwork: false,
      currentNetwork: network.name,
      requiredNetwork: 'sepolia'
    };
  }
  
  return {
    isCorrectNetwork: true,
    currentNetwork: network.name
  };
};

/**
 * Get all NFTs owned by an address
 */
export const getNFTsForAddress = async (address) => {
  try {
    const contract = await getContract(false);
    const tokenIds = await contract.tokensOfOwner(address);
    return tokenIds.map(id => id.toString());
  } catch (error) {
    console.error('Error getting NFTs:', error);
    return [];
  }
};

/**
 * Mint a new NFT
 */
export const mintNFT = async () => {
  try {
    const contract = await getContract(true);
    
    // Get mint price from contract
    const mintPriceWei = await contract.mintPrice();
    
    // Get gas price
    const provider = getProvider();
    const gasPrice = await provider.getGasPrice();
    
    // Estimate gas
    const gasEstimate = await contract.estimateGas.mint({
      value: mintPriceWei
    });
    
    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate.mul(12).div(10);
    
    // Send transaction
    const tx = await contract.mint({
      value: mintPriceWei,
      gasLimit,
      gasPrice
    });
    
    // Return the transaction hash
    return {
      hash: tx.hash,
      wait: async () => {
        const receipt = await tx.wait();
        
        // Find the MoodNFTMinted event to get the tokenId
        const mintEvent = receipt.events.find(event => event.event === 'MoodNFTMinted');
        const tokenId = mintEvent.args.tokenId.toString();
        
        return {
          tokenId,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber
        };
      }
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

/**
 * Listen for Transfer events
 */
export const listenForTransferEvents = (callback) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, MoodNFTABI, provider);
  
  // Listen for Transfer events to the connected address
  const filter = contract.filters.Transfer(null, null, null);
  
  // Add event listener
  contract.on(filter, (from, to, tokenId, event) => {
    callback({
      from,
      to, 
      tokenId: tokenId.toString(),
      transactionHash: event.transactionHash
    });
  });
  
  // Return function to remove event listener
  return () => {
    contract.removeAllListeners(filter);
  };
};