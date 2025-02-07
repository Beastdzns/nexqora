import React, { Fragment, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import { useStore } from '@/store';
import Input from '@/components/form-elements/input';
import { Listbox, Transition } from '@headlessui/react';
import { networkOptions, tokenOptions } from '@/utils/constants';
import Chip from '@/components/Chip';
import useCreateBucket from '@/hooks/useCreateBucket';
import { motion } from "framer-motion";
import axios from 'axios';
import Image from 'next/image';

const networkChainIds = {
  arbitrum: 42161,
  polygon: 137,
  base: 8453,
};

export default function Hero() {
  const {
    bucketName,
    setBucketName,
    selectedNetwork,
    setSelectedNetwork,
    selectedTokens,
    setSelectedTokens,
    setProportion,
  } = useStore();
  const { createBucket } = useCreateBucket();

  // State to store gas fee data
  const [gasFees, setGasFees] = useState({
    low: null,
    medium: null,
    high: null,
  });

  // Fetch gas fees based on selected network
  const fetchGasFees = async (chainId: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY; +
      const apiKeySecret = process.env.NEXT_PUBLIC_API_KEY_SECRET; 
      const Auth = Buffer.from(apiKey + ":" + apiKeySecret).toString("base64");

      const { data } = await axios.get(
        `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
        {
          headers: {
            Authorization: `Basic ${Auth}`,
          },
        }
      );

      setGasFees({
        low: data.low.suggestedMaxFeePerGas,
        medium: data.medium.suggestedMaxFeePerGas,
        high: data.high.suggestedMaxFeePerGas,
      });
    } catch (error) {
      console.log("Error fetching gas fees: ", error);
    }
  };

  // Trigger gas fee fetch whenever the selected network changes
  useEffect(() => {
    if (selectedNetwork) {
      const chainId = networkChainIds[selectedNetwork.name.toLowerCase()];
      if (chainId) {
        fetchGasFees(chainId);
      }
    }
  }, [selectedNetwork]);

  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-12 bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700">
      {/* Hero Section */}
      <div className="ramp h-auto flex flex-col md:flex-row justify-center items-center px-6 md:px-16 text-white min-h-screen w-full">
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left max-w-xl">
          {/* Animated Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
              TokenTechies
            </span>
            <motion.span
              className="block mt-4 text-lg sm:text-xl md:text-2xl font-medium text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              Empowering your investment journey
            </motion.span>
          </motion.h1>

          {/* Animated Paragraph */}
          <motion.p
            className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            Unlock the potential of your investments with seamless tokenized
            solutions for a brighter financial future.
          </motion.p>

          {/* Call-to-Action Button */}
          <motion.div
            className="mt-6 flex justify-center md:justify-start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            <button
              onClick={() =>
                document.getElementById("2")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-500 transition-transform transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </motion.div>
        </div>

        {/* Decorative Image/Graphic */}
        <motion.div
          className="hidden md:flex items-center justify-center w-full md:w-1/2 mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/cartoon.png"  // Image path
            alt="Investment Illustration"
            className="w-full max-w-md lg:max-w-lg object-contain rounded-lg"
            width={500} // Set the width (you can adjust this value)
            height={500} // Set the height (you can adjust this value)
          />
        </motion.div>
      </div>

      {/* Create Bucket Section */}
      <main id='2' className="flex p-6 md:p-8 justify-center items-center min-h-screen bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700">
        <div className="flex flex-col w-full md:w-[60%] gap-6 p-8 bg-neutral-800 border border-gray-700 rounded-xl shadow-xl">
          <h1 className="text-center text-3xl text-teal-300 font-bold font-['trap'] mb-6">
            TRACK YOUR CRYPTO MUTUALS
          </h1>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Bucket Name */}
            <Input
              className="lg:w-1/2 text-gray-200"
              id="bucketName"
              name="bucketname"
              label="Bucket Name"
              placeholder="Enter Bucket Name"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
            />
          </div>

          {/* Network and Tokens Selection */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Network Selection */}
            <div className="lg:w-1/2">
              <label className="text-teal-200 text-sm font-semibold mb-1">
                Select Network
              </label>
              <Listbox
                value={selectedNetwork}
                onChange={(value) => {
                  setSelectedNetwork(value);
                  setSelectedTokens(tokenOptions[value.id]);
                }}
              >
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-700 py-3 pl-4 pr-8 text-left shadow-lg text-white">
                    <span className="block truncate">{selectedNetwork.name}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition-opacity ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-lg bg-gray-800 py-2 text-base shadow-lg focus:outline-none">
                      {networkOptions.map((network, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-600 text-teal-300' : 'text-gray-200'
                            }`
                          }
                          value={network}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-semibold' : 'font-normal'
                                  }`}
                              >
                                {network.name}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-400">
                                  <FaCheck className="h-4 w-4" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Token Selection */}
            <div className="lg:w-1/2">
              <label className="text-teal-200 text-sm font-semibold mb-1">
                Select Tokens
              </label>
              <Listbox
                value={selectedTokens}
                onChange={(value) => {
                  setSelectedTokens(value);
                  const arr = new Array(value.length).fill(0);
                  setProportion(arr);
                }}
                multiple
              >
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-700 py-3 pl-4 pr-8 text-left shadow-lg text-white">
                    <span className="block truncate">
                      {selectedTokens.map((token) => token.name).join(', ')}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition-opacity ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-lg bg-gray-800 py-2 text-base shadow-lg focus:outline-none">
                      {tokenOptions[selectedNetwork.id].map((token, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-600 text-teal-300' : 'text-gray-200'
                            }`
                          }
                          value={token}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-semibold' : 'font-normal'
                                  }`}
                              >
                                {token.name}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-400">
                                  <FaCheck className="h-4 w-4" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Display Gas Fees */}
          <div className="mt-6 text-center text-teal-200">
            {gasFees.low && (
              <>
                <h3 className="text-lg font-semibold">Suggested Gas Fees</h3>
                <p>Low: {gasFees.low} Gwei</p>
                <p>Medium: {gasFees.medium} Gwei</p>
                <p>High: {gasFees.high} Gwei</p>
              </>
            )}
          </div>

          {/* Selected Tokens Display */}
          <div className="flex flex-wrap gap-3 mt-3 justify-center items-center">
            {selectedTokens.map((token, index) => (
              <Chip key={index} name={token.name} url={token.logoURI} index={index} />
            ))}
          </div>

          <button
            onClick={() => createBucket()}
            className="mt-6 py-3 w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-lg transition"
          >
            Create Bucket
          </button>
        </div>
      </main>
    </div>
  );
}
