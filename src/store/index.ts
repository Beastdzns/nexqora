import {
  NetworkOptions,
  TokenOption,
  networkOptions,
  tokenOptions,
} from '@/utils/constants';
import { create } from 'zustand';

interface IStore {
  selectedNetwork: NetworkOptions;
  proportion: string[];
  selectedTokens: TokenOption[];
  bucketName: string;
  bucketDesc: string;
  isPublic: boolean;
  setSelectedNetwork: (network: NetworkOptions) => void;
  setSelectedTokens: (tokens: TokenOption[]) => void;
  setProportion: (proportion: string[]) => void;
  setBucketName: (bucketName: string) => void;
  setBucketDesc: (bucketDesc: string) => void;
  setIsPublic: (isPublic: boolean) => void;
}

const useStore = create<IStore>((set) => ({
  selectedNetwork: networkOptions[0],
  selectedTokens: tokenOptions[0],
  proportion: new Array(tokenOptions[0].length).fill('0'),
  bucketName: '',
  bucketDesc: '',
  isPublic: false,
  setSelectedNetwork: (network) =>
    set({
      selectedNetwork: network,
    }),
  setSelectedTokens: (tokens) =>
    set({
      selectedTokens: tokens,
    }),
  setProportion: (proportion) =>
    set({
      proportion: proportion,
    }),
  setBucketName: (bucketName) =>
    set({
      bucketName: bucketName,
    }),
  setBucketDesc: (bucketDesc) =>
    set({
      bucketDesc: bucketDesc,
    }),
  setIsPublic: (isPublic) =>
    set({
      isPublic: isPublic,
    }),
}));

export { useStore };
