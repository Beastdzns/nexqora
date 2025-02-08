import { getPublicClient } from "@wagmi/core";
import { config } from "@/app/utils/config";
import { mainnet, base, arbitrum, optimism, polygon } from "@wagmi/core/chains";

import { type Chain } from "viem";
export const local = {
  id: 1,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
} as const satisfies Chain;

// Define a union type of allowed chain IDs
type AllowedChainIds =
  | typeof arbitrum.id
  | typeof base.id
  | typeof optimism.id
  | typeof polygon.id
  | typeof mainnet.id;

// Utility function to initialize a client for a specific chain
export const initializeClient = (chainId: AllowedChainIds) => {
  const client = getPublicClient(config, { chainId });
  return client;
};

// Example usage: initializing clients for different chains
export const initializeClientsForAllChains = () => {
  const arbitrumClient = initializeClient(arbitrum.id);
  const baseClient = initializeClient(base.id);
  const optimismClient = initializeClient(optimism.id);
  const polygonClient = initializeClient(polygon.id);
  const mainnetClient = initializeClient(mainnet.id);

  return {
    polygonClient,
    arbitrumClient,
    baseClient,
    mainnetClient,
    optimismClient,
  };
};
