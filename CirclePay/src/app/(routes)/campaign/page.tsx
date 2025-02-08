"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  PlayCircle,
  DollarSign,
  Users,
  PlusCircle,
  Plus,
  X,
  Clock,
  BarChart,
} from "lucide-react";
import ethers from "ethers";
import { decodeEventLog, toEventSignature } from "viem";
import { initializeClient } from "@/app/utils/publicClient";
import contractABI from "@/CirclePay.json";

import { getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";
import { Address, formatEther, pad, parseEther, PublicClient } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import {
  CIRCLEPAY_BASE,
  getContractAddress,
} from "@/app/utils/contractAddresses";
import toast, { Toaster } from "react-hot-toast";

interface Campaign {
  id: string;
  thumbnail: string;
  reserve: number;
  delivered: number;
  status: "active" | "paused" | "completed";
  startDate: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "success" | "danger";
  children: React.ReactNode;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Helper function to format dates consistently
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const AdCampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "0xc92a16fa64c781fe8a292fedf42bd069dedadd5478263c43ba5d5e9a2d4ef41f",
      thumbnail: "",
      reserve: 9999999999900000,
      delivered: 3,
      status: "active",
      startDate: "2024-03-15",
    },
  ]);

  const [showAddReserve, setShowAddReserve] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number>(0);
  const [initialFund, setInitialFund] = useState<number>(0);
  const clientRef = useRef<PublicClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [blockScoutUrl, setblockScoutUrl] = useState("");

  const handleAddReserve = (campaignId: string, amount: string): void => {
    setCampaigns(
      campaigns.map((camp) =>
        camp.id === campaignId
          ? { ...camp, reserve: camp.reserve + Number(amount) }
          : camp
      )
    );
    setShowAddReserve(null);
  };

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "paused":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
    }
  };

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

    const fetchCampaigns = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/get-campaigns?owner=${address}`);
        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }
        const data = await response.json();

        // Transform API data to match Campaign interface
        const formattedCampaigns: Campaign[] = data.map((item: any) => ({
          id: item.id,
          thumbnail: item.thumbnail || "", // Use default empty string if no thumbnail
          reserve: item.reserve.toString(), // Convert to string to handle large numbers
          delivered: item.delivered || 0,
          status: item.status || "active",
          startDate: item.createdAt || new Date().toISOString(),
          owner: item.owner,
        }));

        setCampaigns(formattedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        alert("Failed to fetch campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [address]);

  const handleCreateCampaign = async () => {
    if (!isConnected) {
      alert("Please connect your account to participate.");
      return;
    }

    try {
      if (!clientRef.current) {
        alert("Client not initialized. Please try again.");
        return;
      }

      setIsParticipating(true);
      const tx = await writeContractAsync({
        address: CIRCLEPAY_BASE,
        account: address,
        abi: contractABI.abi,
        functionName: "registerCampaign",
        args: ["abctestid"],
        value: BigInt(parseEther(initialFund.toString())),
      });

      const theUrl = `https://base-sepolia.blockscout.com/tx/${tx}`;
      setblockScoutUrl(theUrl);

      const receipt = await clientRef.current.waitForTransactionReceipt({
        hash: tx,
      });

      const eventTopic =
        "0xa5ad0d6d3cd789710276999982a8c0d3afbbf7ba34e7ccb419748e4fd4dafef0";
      const event = receipt.logs.find((log) => log.topics[0] === eventTopic);

      if (event && receipt) {
        const bytesId = event.data.slice(0, 66);
        const value = BigInt(parseEther(initialFund.toString())).toString();

        const response = await fetch("/api/create-campaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bytesId,
            owner: address,
            reserve: value,
          }),
        });

        if (response.ok) {
          // Fetch updated campaigns after successful creation
          const updatedResponse = await fetch(
            `/api/get-campaigns?owner=${address}`
          );
          const updatedData = await updatedResponse.json();
          const formattedCampaigns: Campaign[] = updatedData.map(
            (item: any) => ({
              id: item.id,
              thumbnail: item.thumbnail || "",
              reserve: item.reserve.toString(),
              delivered: item.delivered || 0,
              status: item.status || "active",
              startDate: item.createdAt || new Date().toISOString(),
              owner: item.owner,
            })
          );
          setCampaigns(formattedCampaigns);
        }
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsParticipating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Campaigns List Section */}
      <div className="w-2/3 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Active Campaigns</h2>
          <div className="flex gap-4">
            <Button variant="outline">
              <Clock size={18} />
              Last 30 days
            </Button>
            <Button variant="outline">
              <BarChart size={18} />
              Analytics
            </Button>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No campaigns found. Create your first campaign!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Thumbnail */}
                    <div className="relative w-80 rounded-lg overflow-hidden group">
                      {campaign.thumbnail ? (
                        <img
                          src={campaign.thumbnail}
                          alt={`Campaign ${campaign.id}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No thumbnail</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <PlayCircle size={48} className="text-white" />
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Campaign {campaign.id.slice(0, 8)}...
                            </h3>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                campaign.status
                              )}`}
                            >
                              {campaign.status.charAt(0).toUpperCase() +
                                campaign.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Started on {formatDate(campaign.startDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-8">
                        <div className="flex items-center gap-3 bg-indigo-50 rounded-lg p-3">
                          <div>
                            <p className="text-sm font-medium text-indigo-900">
                              Funds Reserve
                            </p>
                            <p className="text-lg font-semibold text-indigo-700">
                              {formatEther(BigInt(campaign.reserve))} eth
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-3">
                          <span className="text-emerald-600 bg-emerald-100 p-2 rounded-lg">
                            <Users size={20} />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-emerald-900">
                              Delivered To
                            </p>
                            <p className="text-lg font-semibold text-emerald-700">
                              {campaign.delivered.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {showAddReserve === campaign.id ? (
                        <div className="flex gap-2 items-center mt-4">
                          <Input
                            type="number"
                            placeholder="Amount"
                            className="w-auto"
                            id={`reserve-${campaign.id}`}
                          />
                          <Button
                            variant="success"
                            className="w-auto"
                            onClick={() => {
                              const input = document.getElementById(
                                `reserve-${campaign.id}`
                              ) as HTMLInputElement;
                              handleAddReserve(campaign.id, input.value);
                            }}
                          >
                            <Plus size={18} />
                            Add Funds
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddReserve(null)}
                          >
                            <X size={18} />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setShowAddReserve(campaign.id)}
                          className="mt-4"
                        >
                          <Plus size={18} />
                          Add Reserve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Campaign Form Section */}
      <div className="w-1/3 p-8 bg-white border-l">
        <div className="sticky top-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Create New Campaign
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Video
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <Input
                type="file"
                accept="video/*"
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <PlusCircle className="w-10 h-10 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload video
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM or OGG (Max. 800MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Reserve Amount
            </label>
            <div className="flex gap-2">
              <Input
                onChange={(e) => setInitialFund(Number(e.target.value) || 0)}
                type="number"
                placeholder="Enter amount"
                className="flex-1"
              />
            </div>
          </div>
          <br></br>

          <Button
            onClick={() => handleCreateCampaign()}
            className="w-full justify-center"
          >
            Create Campaign
          </Button>
          {blockScoutUrl == "" ? (
            <></>
          ) : (
            <>
              <Button
                className="w-full justify-center mt-4 bg-gray-600"
                onClick={() => window.open(blockScoutUrl, "_blank")}
              >
                View transaction ↗️
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdCampaignDashboard;
