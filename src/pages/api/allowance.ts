import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

interface RequestBody {
  address: `0x${string}`;
  contractAddress: `0x${string}`;
  chainID: number;
  amount: number;
}

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({ error: 'Method not allowed' });
    }

    const ABI = [
      {
        name: 'approve',
        type: 'function',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
      },
    ] as const;

    const { address, contractAddress, chainID, amount } =
      req.body as RequestBody;

    console.log(process.env.PRIVATE_KEY);

    const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon');

    const signer = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    );
    // create contract instance
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    // call contract method
    const tx = await contract.approve(
      address,
      ethers.parseEther(amount.toString())
    );

    res.status(200).json({ message: tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
