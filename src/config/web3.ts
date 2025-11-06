import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, bsc, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3 Social',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [mainnet, sepolia, bsc, bscTestnet],
  ssr: false,
});
