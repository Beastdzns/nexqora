'use client'
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface SelectWithIconsProps {
    chainName: string;
    SetReceiversChainId: React.Dispatch<React.SetStateAction<number>>;
    setChainName: React.Dispatch<React.SetStateAction<string>>; // Prop to set the selected chain name
}

const chains = [
    { id: 'base', name: 'Base', icon: '/images/base_icon.png', chainId: 84532 },
    { id: 'optimism', name: 'Optimism', icon: '/images/op_icon.svg', chainId: 11155420 },
];

const SelectWithIcons: React.FC<SelectWithIconsProps> = ({ chainName, setChainName, SetReceiversChainId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedChain = chains.find(chain => chain.id === chainName) || chains[0];

    const handleSelect = (chain: string, chainId: number) => {
        setChainName(chain);
        SetReceiversChainId(chainId)
        setIsOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Select Destination Chain
            </label>
            <div className="relative">
                <button
                    type="button"
                    className="w-full pl-2 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white flex items-center justify-between"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center">
                        <Image
                            src={selectedChain.icon}
                            alt={selectedChain.name}
                            className="w-5 h-5 rounded-full mr-2"
                            width={24}
                            height={24}
                        />
                        <span className="text-black">{selectedChain.name}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {chains.map((chain) => (
                            <button
                                key={chain.id}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                                onClick={() => handleSelect(chain.id, chain.chainId)}
                            >
                                <Image
                                    src={chain.icon}
                                    alt={chain.name}
                                    className="w-5 h-5 rounded-full mr-2"
                                    width={24}
                                    height={24}
                                />
                                <span className="text-black">{chain.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectWithIcons;

