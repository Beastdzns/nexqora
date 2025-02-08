import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Transaction } from "@/types/transaction";
import { Search, ArrowUpDown, Copy, Check } from "lucide-react";

const SearchTransactions: React.FC = () => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sender, setSender] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [initiator, setInitiator] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "executed" | "notExecuted"
  >("all");
  const [copiedValues, setCopiedValues] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValues({ ...copiedValues, [id]: true });
      setTimeout(() => {
        setCopiedValues((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Rest of the fetch and handler functions remain the same...

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      className="ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
    >
      {copiedValues[id] ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = "/api/transactions?";
      if (sender) query += `sender=${sender}&`;
      if (receiver) query += `receiver=${receiver}&`;
      if (initiator) query += `initiator=${initiator}&`;
      if (statusFilter !== "all")
        query += `status=${statusFilter === "notExecuted" ? "false" : "true"}`;

      const response = await fetch(query);
      if (!response.ok) throw new Error("Error fetching transactions");
      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (status: "all" | "executed" | "notExecuted") => {
    setStatusFilter(status);
  };

  const SearchInput = ({
    value,
    onChange,
    placeholder,
    label,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    label: string;
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );

  const StatusBadge = ({ executed }: { executed: boolean }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        executed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {executed ? "Executed" : "Pending"}
    </span>
  );

  const AddressDisplay = ({
    address: addr,
    label,
    isYou,
  }: {
    address: string;
    label: string;
    isYou?: boolean;
  }) => (
    <div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium flex items-center">
        <span className="font-mono">{truncateAddress(addr)}</span>
        <CopyButton text={addr} id={`${label}-${addr}`} />
        {isYou && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            You
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Search Section */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Transaction Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SearchInput
              label="Sender Address"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Enter sender address"
            />
            <SearchInput
              label="Receiver Address"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Enter receiver address"
            />
            <SearchInput
              label="Initiator Address"
              value={initiator}
              onChange={(e) => setInitiator(e.target.value)}
              placeholder="Enter initiator address"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-2">
                {["all", "executed", "notExecuted"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      statusFilter === status
                        ? "bg-blue-500 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : status === "executed"
                      ? "Executed"
                      : "Pending"}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={fetchTransactions}
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 min-w-[120px]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ArrowUpDown className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AddressDisplay
                      address={transaction.initiator}
                      label="Initiator"
                      isYou={transaction.initiator === address}
                    />
                    <AddressDisplay
                      address={transaction.sender}
                      label="Sender"
                      isYou={transaction.sender === address}
                    />
                    <AddressDisplay
                      address={transaction.receiver}
                      label="Receiver"
                      isYou={transaction.receiver === address}
                    />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Amount</div>
                      <div className="text-sm font-medium">
                        {transaction.amount}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Chain ID</div>
                      <div className="text-sm font-medium">
                        {transaction.chainId}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <StatusBadge executed={transaction.executed} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Nonce</div>
                      <div className="text-sm font-medium flex items-center font-mono">
                        {truncateAddress(transaction.nonce.toString())}
                        <CopyButton
                          text={transaction.nonce.toString()}
                          id={`nonce-${transaction._id}`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Date</div>
                      <div className="text-sm font-medium">
                        {new Date(
                          transaction.initiateDate
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTransactions;
