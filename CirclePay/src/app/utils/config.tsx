import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, arbitrum, optimism, polygon } from "@wagmi/core/chains";

export const config = getDefaultConfig({
  chains: [mainnet, base, arbitrum, optimism, polygon],
  appName: "RainbowKit demo",
  projectId: "8a002f09d4fc6fba7c4cd6d06df5e19f",
  ssr: true,
});
