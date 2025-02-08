import Navbar from '@/components/NavBar';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig } from 'wagmi';
import { config, ethereumClient } from '@/utils/wagmiConfig';
import { Web3Modal } from '@/context/web3Modal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Web3Modal>
        <Navbar />
        <div className="min-h-[calc(100vh-68px)] pt-16 px-2 sm:px-4">
          <Component {...pageProps} />
        </div>
      </Web3Modal>
    </>
  );
}
