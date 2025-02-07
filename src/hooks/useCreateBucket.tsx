import { parseUnits } from 'viem';
import { useChainId, useContractWrite, usePublicClient } from 'wagmi';
import { polygonAddress } from '@/utils/constants';
import factoryABI from '@/utils/contract/factoryABI.json';
import { useStore } from '@/store';
import { waitForTransactionReceipt } from 'viem/public';
import convertArrayToNumbers from '@/utils/converter';
import getAddresses from '@/utils/getAddresses';

export default function useCreateBucket() {
  const {
    bucketName,
    bucketDesc,
    isPublic,
    setBucketName,
    setBucketDesc,
    setIsPublic,
    selectedNetwork,
    setSelectedNetwork,
    selectedTokens,
    setSelectedTokens,
    proportion,
    setProportion,
  } = useStore();

  const { writeAsync } = useContractWrite({
    abi: factoryABI,
    functionName: 'createBucket',
    address: polygonAddress,
  });
  const chainID = useChainId();
  const { waitForTransactionReceipt } = usePublicClient({
    chainId: chainID,
  });
  async function createBucket() {
    const chains = [];
    for (let index = 0; index < selectedTokens.length; index++) {
      chains.push('');
    }
    try {
      const { hash } = await writeAsync({
        args: [
          isPublic,
          getAddresses(selectedTokens),
          convertArrayToNumbers(proportion),
          chains,
          bucketName,
          bucketDesc,
        ],
      });
      await waitForTransactionReceipt({
        hash: hash,
      });
      return hash;
    } catch (error) {
      console.log(error);
    }
  }
  return { createBucket };
}
