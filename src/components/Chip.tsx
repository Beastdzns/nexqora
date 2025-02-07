import { useStore } from "@/store";
import Image from "next/image";
import React from "react";

export default function Chip({
  name,
  url,
  index,
}: {
  name: string;
  url: string;
  index: number;
}) {
  const { proportion, setProportion } = useStore();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    proportion[index] = e.target.value;
    console.log(proportion);
    setProportion(proportion);
  }

  return (
    <div className="flex w-36">
      <span className="inline-flex items-center px-2 gap-1 text-sm text-gray-200 bg-neutral-800 border rounded-e-0 border-teal-600 rounded-s-md">
        <Image
          src={url}
          className="border border-teal-400 rounded-full"
          alt="token"
          width={20}
          height={20}
        />
        {name}
      </span>
      <input
        type="text"
        id="allocation"
        className="rounded-none rounded-e-lg bg-neutral-900 border text-gray-200 focus:ring-teal-400 focus:border-teal-400 block flex-1 min-w-0 w-full text-sm border-teal-600 p-2.5"
        placeholder="10%"
        value={proportion[index]}
        onChange={(e) => {
          handleChange(e);
        }}
      />
    </div>
  );
}
