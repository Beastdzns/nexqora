export interface Transaction {
  _id: string;
  initiator: string;
  sender: string;
  receiver: string;
  amount: number | string;
  chainId: number;
  validAfter: number;
  validBefore: number;
  nonce: number;
  executed: boolean;
  sign: string;
  destinationChain: number;
  initiateDate: string;
  transactionHash: string;
}
