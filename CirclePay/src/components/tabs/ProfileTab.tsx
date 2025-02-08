import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Transaction } from "@/types/transaction";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Wallet,
  Copy,
  Play,
} from "lucide-react";
import blockies from "blockies-ts";

const ProfileTab: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "pending" | "executed">("all");

  const fetchUserTransactions = async () => {
    setLoading(true);
    try {
      const query = `/api/transactions?userAddress=${address}`;
      const response = await fetch(query);
      if (!response.ok) throw new Error("Error fetching transactions");
      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchUserTransactions();
  }, [address]);

  const formatAmount = (amount: string | number) => {
    return (Number(amount) / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address || "");
    alert("Address copied to clipboard!");
  };

  const handleExecuteTransaction = (transactionId: string) => {
    // Placeholder for executing the transaction
    console.log("Executing transaction:", transactionId);
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) =>
          filter === "pending" ? !tx.executed : tx.executed
        );

  const blockiesImage = blockies
    .create({ seed: address || "", size: 8, scale: 8 })
    .toDataURL();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Transactions
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your past transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full"
              onClick={() => setFilter("pending")}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                {transactions.filter((tx) => !tx.executed).length} Pending
              </span>
            </button>
            <button
              className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full"
              onClick={() => setFilter("executed")}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                {transactions.filter((tx) => tx.executed).length} Executed
              </span>
            </button>
            <button
              className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full"
              onClick={() => setFilter("all")}
            >
              <span className="font-medium">Show All</span>
            </button>
          </div>
        </div>

        {/* Profile Section */}
        {isConnected && (
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <img
              src={blockiesImage}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="text-sm text-gray-500">Your Address</p>
              <div className="flex items-center gap-2">
                <code className="font-mono font-medium text-gray-900">
                  {formatAddress(address || "")}
                </code>
                <button onClick={copyToClipboard} className="text-blue-500">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connection Warning */}
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800">
            <Wallet className="w-5 h-5" />
            <p>
              Please connect your wallet to view and manage your transactions.
            </p>
          </div>
        )}

        {/* Transaction List */}
        {loading ? (
          <div className="text-center text-gray-500">
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Transactions Found
            </h3>
            <p className="text-gray-500">
              You havent initiated or received any transactions yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTransactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          Chain ID: {transaction.chainId}
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
                    <div className="bg-gray-50 rounded-lg p-4">
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
                        <div className="flex items-center gap-3">
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
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

                    {/* Amount and Status */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatAmount(transaction.amount)}
                          </span>
                          <span className="text-sm font-medium text-gray-400">
                            USDC
                          </span>
                        </div>
                      </div>
                      {!transaction.executed && (
                        <button
                          onClick={() =>
                            handleExecuteTransaction(transaction._id)
                          }
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm"
                        >
                          <Play className="w-5 h-5" />
                          Execute
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
