export const polygonAddress = '0x9ba0D7749CC64FdCa0fD2c81E57496Ae0D9776c5';

export type TokenOption = {
  name: string;
  contractAddress: `0x${string}`;
  logoURI: string;
};

export type NetworkOptions = {
  id: number;
  name: string;
  chainid: number;
};

type TokenOptions = TokenOption[][];

const ARB: TokenOption[] = [
  {
    name: 'WETH',
    contractAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    logoURI:
      'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
  },
  {
    name: 'WBTC',
    contractAddress: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
    logoURI:
      'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png',
  },
  {
    name: 'DAI',
    contractAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    logoURI:
      'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
  {
    name: 'LINK',
    contractAddress: '0xf97f4df75117a78c1a5a0dbb814af92458539fb4',
    logoURI:
      'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png',
  },
  {
    name: 'ETH',
    contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    logoURI:
      'https://tokens.1inch.io/0x2170ed0880ac9a755fd29b2688956bd959f933f8.png',
  },
];

const BASE: TokenOption[] = [
  {
    name: 'ETH',
    contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    logoURI:
      'https://tokens.1inch.io/0x2170ed0880ac9a755fd29b2688956bd959f933f8.png',
  },
  {
    name: 'WETH',
    contractAddress: '0x4200000000000000000000000000000000000006',
    logoURI:
      'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
  },
  {
    name: 'DAI',
    contractAddress: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    logoURI:
      'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
];

const POLYGON: TokenOption[] = [
  {
    name: 'WMATIC',
    contractAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    logoURI:
      'https://tokens.1inch.io/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270.png',
  },
  {
    name: 'COMP',
    contractAddress: '0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c',
    logoURI:
      'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png',
  },
  {
    name: 'ETH',
    contractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    logoURI:
      'https://tokens.1inch.io/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619.png',
  },
];

export const networkOptions: NetworkOptions[] = [
  {
    id: 0,
    name: 'Arbitrum',
    chainid: 42161,
  },
  {
    id: 1,
    name: 'Base',
    chainid: 8453,
  },
  {
    id: 2,
    name: 'Polygon',
    chainid: 137,
  },
];

export const tokenOptions: TokenOptions = [ARB, BASE, POLYGON];
