import { useContractWrite } from 'wagmi';

export default function useSendFunds() {
  const USDCABI = [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
    },
  ] as const;

  const { writeAsync } = useContractWrite({
    abi: USDCABI,
    functionName: 'transfer',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  });

  async function sendFunds(amount: string) {
    try {
      const { hash } = await writeAsync({
        args: ['0x03a09604171896C385A79DfcE16B144a570967D5', amount],
      });

      return hash;
    } catch (error) {
      console.log(error);
    }
  }
  return { sendFunds };
}
