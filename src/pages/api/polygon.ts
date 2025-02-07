// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  FusionSDK,
  NetworkEnum,
  PrivateKeyProviderConnector,
} from '@1inch/fusion-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseUnits } from 'viem';
import Web3 from 'web3';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fromTokenAddress, toTokenAddress, amount, decimal } = req.body;

    const makerPrivateKey = process.env.PRIVATE_KEY as string;
    const makerAddress = '0x9c6691eE4a6DdB2580A6A7227c7C50cC8D147AA9';

    const nodeUrl = 'https://rpc.ankr.com/polygon';
    const web3Instance = new Web3(nodeUrl);

    const blockchainProvider = new PrivateKeyProviderConnector(
      makerPrivateKey,
      web3Instance as any
    );

    const sdk = new FusionSDK({
      url: 'https://api.1inch.dev/fusion',
      network: NetworkEnum.POLYGON,
      blockchainProvider,
      authKey: 'LwYawtmJTAci1ken3LwCtt0Sc4WEhpTY',
    });

    sdk
      .placeOrder({
        fromTokenAddress: fromTokenAddress, //USDC
        toTokenAddress: toTokenAddress, //WETH
        amount: parseUnits(amount, decimal).toString(),
        walletAddress: makerAddress,
      })
      .then((order) => {
        return res.status(200).json({ message: order.orderHash });
      });

    return res.status(500).json({ error: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
