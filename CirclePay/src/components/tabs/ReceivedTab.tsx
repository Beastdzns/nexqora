import React, { useEffect, useState, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Address, pad, PublicClient } from "viem";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Wallet,
  Loader2,
  CheckCircle,
  ExternalLink,
  Play,
} from "lucide-react";

import contractABI from "@/usdc.json";
import { initializeClient } from "@/app/utils/publicClient";
import { getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";
import {
  getContractAddress,
  getEtherscanBaseUrl,
} from "@/app/utils/contractAddresses";
import { Transaction } from "@/types/transaction";

const ReceivedTab: React.FC = () => {
  const { writeContractAsync } = useWriteContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chainId, setChainId] = useState<number>(0);
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string>("");
  const { address, isConnected } = useAccount();
  const clientRef = useRef<PublicClient | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "executed">("pending");

  const pendingTransactions = transactions.filter((tx) => !tx.executed);
  const executedTransactions = transactions.filter((tx) => tx.executed);
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
        const response = await fetch(`api/transactions?receiver=${address}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

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

  const handleExecute = (transaction: Transaction) => {
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
  };

  const formatAddress = (address: string) => {
    if (!address) return "N/A"; // Return a fallback value if address is undefined
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: string | number) => {
    return (Number(amount) / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 4,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Received Transactions
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your received transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                {pendingTransactions.length} Pending
              </span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {executedTransactions.length} Executed
              </span>
            </div>
          </div>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
            <Wallet className="w-5 h-5" />
            <p>Please connect your wallet to execute received transactions</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "pending"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Transactions
          </button>
          <button
            onClick={() => setActiveTab("executed")}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "executed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Executed Transactions
          </button>
        </div>

        {/* Empty States */}
        {activeTab === "pending" && pendingTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Pending Transactions
            </h3>
            <p className="text-gray-500">
              You dont have any pending transactions to execute
            </p>
          </div>
        ) : activeTab === "executed" && executedTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Executed Transactions
            </h3>
            <p className="text-gray-500">
              You havent executed any transactions yet
            </p>
          </div>
        ) : (
          /* Transaction Grid */
          <div className="grid gap-6 md:grid-cols-2">
            {(activeTab === "pending"
              ? pendingTransactions
              : executedTransactions
            )
              .slice()
              .reverse()
              .map((transaction) => {
                // Determine chain display text
                const chainDisplay =
                  transaction.chainId === transaction.destinationChain
                    ? `Chain ID: ${transaction.chainId}`
                    : `Chain: ${transaction.chainId} → ${transaction.destinationChain}`;

                return (
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
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {chainDisplay}
                          </span>
                          {transaction.executed && (
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Executed
                            </span>
                          )}
                        </div>
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
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                              <Wallet className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">From</p>
                              <div className="flex items-center gap-2">
                                <code className="font-mono font-medium text-gray-900">
                                  {formatAddress(transaction.sender)}
                                </code>
                                {transaction.sender === address && (
                                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">To</p>
                            <div className="flex items-center gap-2">
                              <code className="font-mono font-medium text-gray-900">
                                {formatAddress(transaction.receiver)}
                              </code>
                              {transaction.receiver === address && (
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Action */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatAmount(transaction.amount)}
                            </span>
                            <span className="text-gray-500">USDC</span>
                          </div>
                        </div>
                        {!transaction.executed && (
                          <button
                            onClick={() => handleExecute(transaction)}
                            disabled={isParticipating}
                            className={`px-6 py-3 rounded-lg font-medium transition-all
                    ${
                      isParticipating && processingId === transaction._id
                        ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                    }`}
                          >
                            {isParticipating &&
                            processingId === transaction._id ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing
                              </span>
                            ) : (
                              <button className="flex items-center gap-2">
                                <Play className="w-5 h-5" />
                                Execute
                              </button>
                            )}
                          </button>
                        )}

                        {/* Transaction Hash */}
                        {transaction.executed && chainId && (
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 text-gray-400">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <a
                                href={`${getEtherscanBaseUrl(
                                  transaction.chainId
                                )}/tx/${transaction.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
                              >
                                <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded-md shadow-sm">
                                  {formatAddress(transaction.transactionHash)}
                                </span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedTab;
