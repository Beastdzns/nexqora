// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FusionSDK, NetworkEnum, PrivateKeyProviderConnector } from '@1inch/fusion-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseUnits } from 'viem';
import Web3 from 'web3';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const { fromTokenAddress, toTokenAddress, amount } = req.body;

  const makerPrivateKey = '2f37a260260e29d8d185abd90a847da02243af678b033cd4c6e42c6aa75dd972'
  const makerAddress = '0xa965a3478cEF1eEF42Ca96Ad60195540cB3cD8e3';

  const nodeUrl = 'https://base.llamarpc.com';
  const web3Instance = new Web3(nodeUrl);


  const blockchainProvider = new PrivateKeyProviderConnector(
    makerPrivateKey,
    web3Instance as any
  )

  const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: NetworkEnum.COINBASE,
    blockchainProvider,
    authKey: 'LwYawtmJTAci1ken3LwCtt0Sc4WEhpTY'
  })

  sdk.placeOrder({
    fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //USDC
    toTokenAddress: '0x4200000000000000000000000000000000000006',  //WETH
    amount: parseUnits('6', 6).toString(),
    walletAddress: makerAddress
  }).then((order) => {
    console.log(order.orderHash);
  });

  res.status(200).json({ name: 'SHLOK' })
  } catch (error) {
    console.log(error);
  }
}
