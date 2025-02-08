import React, { useEffect, useState, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, pad, PublicClient } from "viem";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Wallet,
  Loader2,
  Search,
} from "lucide-react";
import contractABI from "@/usdc.json";
import circlePayABI from "@/CirclePay.json";
import { initializeClient } from "@/app/utils/publicClient";
import { getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";
import {
  CIRCLEPAY_BASE,
  getContractAddress,
} from "@/app/utils/contractAddresses";
import { Transaction } from "@/types/transaction";

interface SponsorTabProps {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const SponsorTab: React.FC<SponsorTabProps> = ({ setActiveTab }) => {
  const { writeContractAsync } = useWriteContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string>("");
  const { address, isConnected } = useAccount();
  const clientRef = useRef<PublicClient | null>(null);
  const [blockScoutUrl, setblockScoutUrl] = useState("");

  useEffect(() => {
    const setupClient = async () => {
      try {
        const currentChainId = getChainId(config);
        setChainId(currentChainId);
        const newClient = initializeClient(currentChainId);
        clientRef.current = newClient as PublicClient;
      } catch (error) {
        console.error("Error initializing client:", error);
      }
    };

    setupClient();
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions?status=false");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Transaction[] = await response.json();
        console.log(data);
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    setFilteredTransactions(
      transactions.filter(
        (transaction) =>
          transaction.sender.toLowerCase().includes(lowercasedTerm) ||
          transaction.receiver.toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [searchTerm, transactions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTransfer = async (
    from: string,
    to: string,
    value: string | number,
    nonce: number,
    sign: string,
    validAfter: number,
    validBefore: number,
    transactionId: string
  ) => {
    console.log("same chain transfer: calling transferWithAuthorization");
    if (!isConnected) {
      alert("Please connect your account to participate.");
      return;
    }

    setProcessingId(transactionId);
    const validateAddress = (address: string): `0x${string}` => {
      return address.startsWith("0x")
        ? (address as `0x${string}`)
        : (`0x${address}` as `0x${string}`);
    };

    try {
      if (!clientRef.current) {
        alert("Client not initialized. Please try again.");
        return;
      }
      setIsParticipating(true);

      const tx = await writeContractAsync({
        address: (await getContractAddress(chainId)) as Address,
        account: address,
        abi: contractABI,
        functionName: "transferWithAuthorization",
        args: [
          from,
          to,
          value,
          validAfter,
          validBefore,
          pad(validateAddress(nonce.toString())),
          sign,
        ],
      });

      const receipt = await clientRef.current.waitForTransactionReceipt({
        hash: tx,
      });

      if (receipt) {
        await fetch("/api/execute", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId,
            transactionHash: receipt.transactionHash,
          }),
        });
        setIsParticipating(false);
      }
    } catch (error) {
      console.error("Error participating:", error);
    } finally {
      setIsParticipating(false);
      setProcessingId("");
    }
  };

  const handleCrossChainTransfer = async (
    from: string,
    to: string,
    value: string | number,
    nonce: number,
    sign: string,
    validAfter: number,
    validBefore: number,
    destinationChain: number,
    transactionId: string
  ) => {
    console.log("doing crosschain");
    if (!isConnected) {
      alert("Please connect your account to participate.");
      return;
    }

    setProcessingId(transactionId);
    const validateAddress = (address: string): `0x${string}` => {
      return address.startsWith("0x")
        ? (address as `0x${string}`)
        : (`0x${address}` as `0x${string}`);
    };

    try {
      if (!clientRef.current) {
        alert("Client not initialized. Please try again.");
        return;
      }
      setIsParticipating(true);

      const tx = await writeContractAsync({
        address: CIRCLEPAY_BASE,
        account: address,
        abi: circlePayABI.abi,
        functionName: "transferUsdcCrossChain",
        args: [
          from,
          value,
          validAfter,
          validBefore,
          pad(validateAddress(nonce.toString())),
          sign,
          destinationChain,
          to,
        ],
      });

      const receipt = await clientRef.current.waitForTransactionReceipt({
        hash: tx,
      });

      if (receipt) {
        await fetch("/api/execute", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId,
            transactionHash: receipt.transactionHash,
          }),
        });
        setIsParticipating(false);
      }
    } catch (error) {
      console.error("Error participating:", error);
    } finally {
      setIsParticipating(false);
      setProcessingId("");
    }
  };

  // main function to call either handleTransfer(same chain) OR handleCrossChainTransfer(cross chain)
  const handleExecute = (transaction: Transaction) => {
    console.log(transaction.chainId);
    console.log(transaction.destinationChain);
    if (transaction.chainId != transaction.destinationChain) {
      handleCrossChainTransfer(
        transaction.sender,
        transaction.receiver,
        transaction.amount,
        transaction.nonce,
        transaction.sign,
        transaction.validAfter,
        transaction.validBefore,
        transaction.destinationChain,
        transaction._id
      );
    } else {
      handleTransfer(
        transaction.sender,
        transaction.receiver,
        transaction.amount,
        transaction.nonce,
        transaction.sign,
        transaction.validAfter,
        transaction.validBefore,
        transaction._id
      );
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: string | number) => {
    return (Number(amount) / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section with Search */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Spread Joy, Pay Their Way! 🤝
            </h1>
            <p className="text-gray-600 mt-2">
              Be the spark that lights someones day - cover their gas, make
              their transaction play ✨
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              {filteredTransactions.length} Pending
            </span>
          </div>
          <div className="flex items-center bg-white shadow-sm rounded-lg px-4 py-2">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search by address"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-transparent focus:outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
            <Wallet className="w-5 h-5" />
            <p>
              Please connect your wallet to participate in transaction execution
            </p>
          </div>
        )}

        {/* Empty State */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Matching Transactions
            </h3>
            <p className="text-gray-500">
              Try a different address or check back later.
            </p>
            <button
              className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 my-4"
              onClick={() => setActiveTab(3)}
            >
              {" "}
              Send Token
            </button>
          </div>
        ) : (
          /* Transaction Grid */
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTransactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div
                  key={transaction._id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200
                    ${
                      processingId === transaction._id
                        ? "ring-2 ring-blue-500"
                        : "hover:shadow-md"
                    }`}
                >
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {transaction.chainId}
                      </span>
                      <ArrowRight className="text-gray-400" />

                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {transaction.destinationChain}
                      </span>
                      <time className="text-sm text-gray-500">
                        {new Date(
                          transaction.initiateDate
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          transaction.initiateDate
                        ).toLocaleTimeString()}
                      </time>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-gray-500 font-medium">
                            From
                          </div>
                          <div className="font-semibold text-gray-800">
                            {formatAddress(transaction.sender)}
                          </div>
                        </div>
                        <ArrowRight className="text-gray-400" />
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-gray-500 font-medium">
                            To
                          </div>
                          <div className="font-semibold text-gray-800">
                            {formatAddress(transaction.receiver)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-2 font-bold text-blue-700">
                        {formatAmount(transaction.amount)} USDC
                      </div>
                    </div>

                    {/* Execute Button */}
                    <button
                      onClick={() => handleExecute(transaction)}
                      disabled={
                        processingId === transaction._id || isParticipating
                      }
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-lg font-semibold"
                    >
                      {processingId === transaction._id ? (
                        <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                      ) : (
                        "Execute Transaction"
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorTab;
