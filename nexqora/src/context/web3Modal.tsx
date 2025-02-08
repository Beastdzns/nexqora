import { WagmiConfig } from 'wagmi'; // Import WagmiConfig
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { arbitrum, base, baseGoerli, mainnet, polygon, scrollSepolia } from 'viem/chains';

// Define your Web3Modal projectId
const projectId = '42cb45787690d40d3009bfd5c28bbbc4';

const metadata = {
  name: 'Cyber Surge',
  description: 'Cyber Surge',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Define the chains to be used
const chains = [polygon, scrollSepolia, baseGoerli];

// Create wagmiConfig using defaultWeb3ModalConfig
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Initialize Web3Modal (outside the component, in the setup or app component)
createWeb3Modal({
  wagmiConfig, // Pass the config to Web3Modal
  projectId,
  chains,
  defaultChain: mainnet,
  themeMode: 'dark',
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
