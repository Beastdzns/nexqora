import { NextApiRequest, NextApiResponse } from 'next';
import finnABI from '@/utils/contract/finnABI.json';
import { ethers } from 'ethers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({ error: 'Method not allowed' });
    }

    const { contractAddress, amount } = req.body;

    const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon');

    const signer = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    );
    // create contract instance
    const contract = new ethers.Contract(contractAddress, finnABI, signer);

    // call contract method
    const tx = await contract.addToken(
      contractAddress,
      ethers.parseEther(amount.toString())
    );

    // wait for tx confirmation
    await tx.wait();

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
