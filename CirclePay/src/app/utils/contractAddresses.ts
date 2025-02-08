// contractAddresses.ts
export const CONTRACT_ADDRESSES: { [key: number]: string } = {
    421614: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // For chain ID ARB sepolia
    42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // For chain ID ARB mainnet
    10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // For chain ID OP mainnet
    11155420: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7", // For chain ID OP sepolia
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // For chain ID BASE sepolia
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // For chain ID BASE mainnt
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // For chain ID mainnet
    5: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // For chain ID mainnet
    80002 : "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582", // For chain ID mainnet
    137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // For chain ID mainnet
  };

  export const CIRCLEPAY_BASE = "0xca31f2E4A6595586A617Ae6bf194EfcB243C187e";
  export const CIRCLEPAY_ARB = "0xca31f2E4A6595586A617Ae6bf194EfcB243C187e";
  export const CIRCLEPAY_OP = "0xca31f2E4A6595586A617Ae6bf194EfcB243C187e";
  
  export const getContractAddress = async (chainId: number): Promise<string | undefined> => {
    return CONTRACT_ADDRESSES[chainId];
  };
  
  
  export const ETHERSCAN_URLS: { [key: number]: string } = {
    1: "https://etherscan.io",
    5: "https://sepolia.etherscan.io", // For Sepolia testnet
    421614: "https://sepolia.arbiscan.io", // Example URL for chain ID 421614
    84532: "https://sepolia.basescan.org", // Replace with actual explorer URL
  };
  
 
  
  export const getEtherscanBaseUrl = (chainId: number): string | undefined => {
    return ETHERSCAN_URLS[chainId];
  };