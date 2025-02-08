
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

  const makerPrivateKey = 'd57b597a6575bcfad10a7fbbb53575250db37c9c3514cce86af8e40b0e6d6a83'
  const makerAddress = '0x03EAC4DEB62AAEAA17939f58E46AdA0C81F60AC0';

  const nodeUrl = 'https://arb1.arbitrum.io/rpc';

  const web3Instance = new Web3(nodeUrl);

  const blockchainProvider = new PrivateKeyProviderConnector(
    makerPrivateKey,
    web3Instance as any
  )

  const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: NetworkEnum.ARBITRUM,
    blockchainProvider,
    authKey: 'LwYawtmJTAci1ken3LwCtt0Sc4WEhpTY'
  })

  sdk.placeOrder({
    fromTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', //USDT
    toTokenAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', //LINK
    amount: parseUnits('5', 6).toString(),
    walletAddress: makerAddress
  }).then((order:any) => {
    console.log(order.orderHash);
  });

  res.status(200).json({ name: 'John Doe' })
  } catch (error) {
    console.log(error);
  }
}
