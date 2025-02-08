import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { GiWallet } from 'react-icons/gi';
import { MdOutlineCancel } from 'react-icons/md';
import Input from './form-elements/input';
import useSendFunds from '@/hooks/useSendFunds';
import { tokenOptions, networkOptions, TokenOption } from '@/utils/constants';
import { useChainId } from 'wagmi';

interface IBucket {
  data: any;
}

const Chips = ({
  name,
  uri,
  proportion,
}: {
  name: string;
  uri: string;
  proportion: string;
}) => {
  return (
    <div className="flex flex-row p-2 px-4 bg-neutral-800 text-gray-200 justify-between rounded-lg">
      <div className="flex gap-2">
        <Image
          src={uri}
          className="rounded-full"
          alt="token"
          width={25}
          height={25}
        />
        {name}
      </div>
      <p className="text-teal-400">{Number(proportion)}%</p>
    </div>
  );
};

export default function Card({ data }: IBucket) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const chainId = useChainId();
  const { sendFunds } = useSendFunds();

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col w-76 p-5 font-['Roobert'] bg-neutral-800 border border-teal-400 rounded-lg">
      <h1 className="text-gray-200">{data?.[5] || 'Unknown Title'}</h1>
      <p className="text-gray-400">{data?.[6] || 'No Description Available'}</p>
      <div className="flex flex-row justify-between mt-2">
        <div className="flex items-center ml-3">
          <Image
            className="w-8 h-8 -ml-3 rounded-full"
            src="https://tokens.1inch.io/0x2170ed0880ac9a755fd29b2688956bd959f933f8.png"
            alt=""
            height={150}
            width={150}
          />
          <Image
            className="w-8 h-8 -ml-3 rounded-full"
            src="https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png"
            alt=""
            height={150}
            width={150}
          />
        </div>
        <button
          type="button"
          onClick={openModal}
          className="flex flex-row w-[60%] md:w-[40%] gap-2 font=['Roobert'] justify-center items-center text-teal-300 bg-neutral-700 hover:bg-teal-400 hover:text-black py-1 px-1.5 rounded-3xl"
        >
          Deposit <GiWallet size={15} />
        </button>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-900 p-8 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="flex flex-row items-center justify-between text-2xl font-medium font-['trap'] leading-6 text-teal-400"
                    >
                      Bucket Details
                      <div
                        className="text-red-500 hover:cursor-pointer"
                        onClick={closeModal}
                      >
                        <MdOutlineCancel size={25} />
                      </div>
                    </Dialog.Title>
                    <div className="flex flex-col mt-2 font-['Roobert']">
                      <h1 className="font-semibold text-xl text-gray-200">
                        {data?.[5] || 'No Name Available'}
                      </h1>
                      <p className="text-md text-gray-400">{data?.[6]}</p>
                      <div className="flex flex-col gap-2 my-2">
                        {Array.isArray(data?.[2]) && data[2]?.length > 0 ? (
                          data[2].map((token: string, index: number) => {
                            const chain = networkOptions.find(
                              (chain) => chain.chainid === chainId
                            );

                            if (!chain) return null; // Ensure it handles missing chainId
                            const tokenDetails = tokenOptions[chain.id].find(
                              (tokenD: TokenOption) =>
                                tokenD.contractAddress.toLowerCase() ===
                                token.toLowerCase()
                            );

                            if (!tokenDetails) return null;
                            return (
                              <Chips
                                key={index}
                                name={tokenDetails.name}
                                uri={tokenDetails.logoURI}
                                proportion={data[3][index]}
                              />
                            );
                          })
                        ) : (
                          <p>No tokens available</p>
                        )}
                      </div>
                      <div className="flex gap-4 flex-row items-end justify-center">
                        <div className="flex w-3/4">
                          <Input
                            id="amount"
                            name="amount"
                            label="Amount"
                            placeholder="Enter amount"
                            value={amount.toString()}
                            onChange={(e) => {
                              setAmount(e.target.value);
                            }}
                          />
                        </div>
                        <div className="flex">
                          <button
                            className="flex w-full font=['Roobert'] font-semibold justify-center items-center border border-teal-400 bg-teal-400 hover:bg-teal-500 text-black p-2.5 px-4 rounded-xl"
                            onClick={async () => {
                              setIsLoading(true);
                              await sendFunds(amount.toString());
                              for (
                                let index = 0;
                                index < data[2].length;
                                index++
                              ) {
                                await fetch('/api/polygon', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    fromTokenAddress:
                                      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
                                    toTokenAddress: data[2][index],
                                    amount:
                                      (Number(amount) *
                                        Number(data[3][index])) / 100,
                                    decimal: 6,
                                  }),
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                }).then((res) => {
                                  console.log(res.json());
                                });
                              }

                              for (
                                let index = 0;
                                index < data[2].length;
                                index++
                              ) {
                                await fetch('/api/allowance', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    address: data[0],
                                    contractAddress: data[2][index],
                                    amount: amount.toString(),
                                  }),
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                }).then((res) => {
                                  console.log(res.json());
                                });
                              }

                              for (
                                let index = 0;
                                index < data[2].length;
                                index++
                              ) {
                                await fetch('/api/addToken', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    contractAddress: data[2][index],
                                    amount: amount.toString(),
                                  }),
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                }).then((res) => {
                                  console.log(res.json());
                                });
                              }

                              for (
                                let index = 0;
                                index < data[2].length;
                                index++
                              ) {
                                await fetch('/api/withdrawToken', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    contractAddress: data[2][index],
                                  }),
                                  headers: new Headers({
                                    'Content-Type': 'application/json',
                                  }),
                                }).then(async (res) => {
                                  console.log(await res.json());
                                });
                              }
                              setIsLoading(false);
                            }}
                          >
                            {isLoading ? 'Loading...' : 'Deposit'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
