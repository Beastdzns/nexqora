"use client";
import { useState, useEffect, useRef } from "react";
import { Address, encodePacked, keccak256, PublicClient } from "viem";
import { signTypedData, getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";
import { initializeClient } from "@/app/utils/publicClient";
import { useAccount } from "wagmi";
import axios from "axios";
import {
  getContractAddress,
  CIRCLEPAY_BASE,
} from "@/app/utils/contractAddresses";
import {
  Calendar,
  Info,
  Wallet,
  ArrowRight,
  Network,
  Send,
} from "lucide-react";
import SelectWithIcons from "./SelectWithIcons";

export default function NewPostTab() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [validAfter, setValidAfter] = useState<number | string>("");
  const [validBefore, setValidBefore] = useState<number | string>("");
  const [nonce, setNonce] = useState("");
  const [isValidAfterZero, setIsValidAfterZero] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [signature, setSignature] = useState("");
  const { address, isConnected } = useAccount();
  const [chainId, setChainId] = useState<number>(0);
  const [chainName, setChainName] = useState<string>("base");
  const [receiversChainId, SetReceiversChainId] = useState<number>(84532);
  const clientRef = useRef<PublicClient | null>(null);

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
  }, []);

  const isCrossChain = () => {
    if (receiversChainId != chainId) {
      return true;
    } else {
      return false;
    }
  };

  const validateAddress = (address: string): `0x${string}` => {
    return address.startsWith("0x")
      ? (address as `0x${string}`)
      : (`0x${address}` as `0x${string}`);
  };

  const generateNonce = async () => {
    if (!address) {
      throw new Error("Address is required");
    }

    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const packedData = keccak256(
      encodePacked(["address", "uint256"], [address, timestamp])
    );
    const theNonce = keccak256(packedData);
    setNonce(theNonce);
    return theNonce;
  };

  const handleSign = async () => {
    setIsLoading(true);
    const chainId = getChainId(config);
    console.log(chainId);
    console.log((await getContractAddress(chainId)) as Address);

    try {
      const theNonce = await generateNonce();
      const validFrom = validateAddress(from);
      const validTo = validateAddress(to);

      const valueBigInt = BigInt(Math.round(Number(value) * 1_000_000));
      const validAfterTimestamp = isValidAfterZero
        ? BigInt(0)
        : BigInt(validAfter);
      const validBeforeTimestamp = BigInt(validBefore);

      const signature = await signTypedData(config, {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          TransferWithAuthorization: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "validAfter", type: "uint256" },
            { name: "validBefore", type: "uint256" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        domain: {
          name: "USDC",
          version: "2",
          chainId: BigInt(chainId),
          verifyingContract: (await getContractAddress(chainId)) as Address,
        },
        primaryType: "TransferWithAuthorization",
        message: {
          from: validFrom,
          // to: validTo,
          to: isCrossChain() ? CIRCLEPAY_BASE : validTo,
          value: valueBigInt,
          validAfter: validAfterTimestamp,
          validBefore: validBeforeTimestamp,
          nonce: theNonce,
        },
      });

      setSignature(signature);
      console.log(signature);

      try {
        const response = await axios.post("/api/initiateTransaction", {
          initiator: address,
          sender: from,
          receiver: to,
          amount: BigInt(Math.round(Number(value) * 1_000_000)).toString(),
          validAfter: validAfterTimestamp.toString(),
          validBefore: validBeforeTimestamp.toString(),
          chainId: chainId,
          sign: signature,
          nonce: theNonce.toString(),
          destinationChain: receiversChainId,
        });

        console.log("API response:", response.data);
      } catch (apiError) {
        console.log(apiError);
        console.error("API call error:", apiError);
        alert("Failed to submit transaction to API");
      }
    } catch (error) {
      console.error("Error signing data:", error);
      alert("Failed to sign transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Addresses" },
    { number: 2, title: "Amount" },
    { number: 3, title: "Timing" },
    { number: 4, title: "Review" },
  ];

  // Validation functions for each step
  const isStep1Valid = () => {
    return from.trim() !== "" && to.trim() !== "";
  };

  const isStep2Valid = () => {
    return value.trim() !== "" && parseFloat(value) > 0;
  };

  const isStep3Valid = () => {
    // If isValidAfterZero is true, we only need to check validBefore
    // If isValidAfterZero is false, we need to check both validAfter and validBefore
    return validBefore !== "" && (isValidAfterZero || validAfter !== "");
  };

  const handleNextStep = () => {
    switch (activeStep) {
      case 1:
        if (isStep1Valid()) {
          setActiveStep(activeStep + 1);
        }
        break;
      case 2:
        if (isStep2Valid()) {
          setActiveStep(activeStep + 1);
        }
        break;
      case 3:
        if (isStep3Valid()) {
          setActiveStep(activeStep + 1);
        }
        break;
    }
  };
  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                From Address
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="0x..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                To Address
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="0x..."
                />
              </div>
            </div>
            <div className="relative">
              <SelectWithIcons
                setChainName={setChainName}
                chainName={chainName}
                SetReceiversChainId={SetReceiversChainId}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount (USDC)
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="number"
                  className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">USDC</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="validAfterZero"
                  checked={isValidAfterZero}
                  onChange={() => {
                    setIsValidAfterZero(!isValidAfterZero);
                    setValidAfter(isValidAfterZero ? "" : "0");
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="validAfterZero"
                  className="text-sm text-gray-700"
                >
                  Valid immediately
                </label>
              </div>

              {!isValidAfterZero && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Valid After
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="datetime-local"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={
                        validAfter
                          ? new Date(Number(validAfter) * 1000)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setValidAfter(new Date(e.target.value).getTime() / 1000)
                      }
                      disabled={isValidAfterZero}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Valid Before
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="datetime-local"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={
                      validBefore
                        ? new Date(Number(validBefore) * 1000)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setValidBefore(new Date(e.target.value).getTime() / 1000)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">From</span>
                <span className="text-gray-900 font-medium">{from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To</span>
                <span className="text-gray-900 font-medium">{to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-900 font-medium">{value} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valid After</span>
                <span className="text-gray-900 font-medium">
                  {isValidAfterZero
                    ? "Immediately"
                    : new Date(Number(validAfter) * 1000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valid Before</span>
                <span className="text-gray-900 font-medium">
                  {new Date(Number(validBefore) * 1000).toLocaleString()}
                </span>
              </div>
              {signature && (
                <div className="mt-4">
                  <span className="text-gray-600">Signature:</span>
                  <p className="mt-1 text-xs text-gray-900 break-all font-mono">
                    {signature}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Send USDC, Skip the Gas! ⛽️
              </h1>
              <p className="mt-2 text-gray-600">
                Let someone else handle the heavy lifting while you make the
                magic happen
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        activeStep >= step.number
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`ml-2 text-sm hidden sm:block ${
                        activeStep >= step.number
                          ? "text-indigo-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 w-12 mx-2 ${
                          activeStep > step.number
                            ? "bg-indigo-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="mt-8">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {activeStep > 1 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              {activeStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className={`ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center ${
                    ((activeStep === 1 && !isStep1Valid()) ||
                      (activeStep === 2 && !isStep2Valid()) ||
                      (activeStep === 3 && !isStep3Valid())) &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={
                    !isConnected ||
                    (activeStep === 1 && !isStep1Valid()) ||
                    (activeStep === 2 && !isStep2Valid()) ||
                    (activeStep === 3 && !isStep3Valid())
                  }
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSign}
                  className={`ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center disabled:opacity-50 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      <span className="ml-2">Sign Transaction</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                How Does This Magic Work? ✨
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No gas, no stress! We use smart signature tech (
                <span className="font-bold">EIP-712</span> &{" "}
                <span className="font-bold">EIP-3009</span>) to let you create
                USDC transfers that others can power up later. Think of it like
                sending a pre-approved package - you pack it, someone else
                delivers it!
              </p>
              {!isConnected && (
                <p className="mt-2 text-sm text-indigo-600">
                  Please connect your wallet to continue.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-sm text-yellow-700">
                Please connect your wallet to use this feature.
              </p>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {!isConnected && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">
                Please connect your wallet first.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
