/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/next";
import { MongoClient, ObjectId } from "mongodb";
import usdcAbi from "@/usdc.json";
import circlePayAbi from "@/CirclePay.json";
import { Address, pad } from "viem";
import { getContractAddress } from "@/app/utils/contractAddresses";

// MongoDB connection
const uri =
  process.env.NEXT_PUBLIC_MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);
const dbName = "transferData";
const collectionName = "Transactions";

const app = new Frog({
  basePath: "/api/share",
  title: "Frog Frame",
});

const fetchTransactions = async (id: string) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Fetch transactions matching the query
  const objectId = new ObjectId(id);
  const transactions = await collection.find({ _id: objectId }).toArray();
  // console.log(transactions);
  return transactions[0];
};

const validateAddress = (address: string): `0x${string}` => {
  return address.startsWith("0x")
    ? (address as `0x${string}`)
    : (`0x${address}` as `0x${string}`);
};

app.transaction("/execute/:id", async (c) => {
  const id = c.req.param();
  console.log("execute EP CALLED-----------");

  const txObj = await fetchTransactions(id.id);
  console.log(txObj);
  console.log("the initi", txObj.initiator);
  const contractAddress = await getContractAddress(txObj.chainId);

  const chainEip = `eip155:${txObj.chainId}`;
  const allowedChainIds = [
    "eip155:1",
    "eip155:10",
    "eip155:100",
    "eip155:137",
    "eip155:8453",
    "eip155:42161",
    "eip155:42170",
    "eip155:84532",
    "eip155:421614",
    "eip155:7777777",
    "eip155:11155111",
    "eip155:11155420",
    "eip155:666666666",
  ] as const;

  if (!allowedChainIds.includes(chainEip as (typeof allowedChainIds)[number])) {
    throw new Error(`Invalid chain ID: ${chainEip}`);
  }

  if (txObj.chaidId == txObj.destinationChainId) {
    // same chain
    console.log("same chain tx");
    return c.contract({
      abi: usdcAbi,
      chainId: chainEip as (typeof allowedChainIds)[number],
      functionName: "transferWithAuthorization",
      args: [
        txObj.sender,
        txObj.receiver,
        txObj.amount,
        txObj.validAfter,
        txObj.validBefore,
        pad(validateAddress(txObj.nonce.toString())),
        txObj.sign,
      ],
      to: contractAddress as Address,
    });
  } else {
    // cross chain
    console.log("cross chain tx");

    return c.contract({
      abi: circlePayAbi.abi,
      chainId: chainEip as (typeof allowedChainIds)[number],
      functionName: "transferUsdcCrossChain",
      args: [
        txObj.sender,
        txObj.amount,
        txObj.validAfter,
        txObj.validBefore,
        pad(validateAddress(txObj.nonce.toString())),
        txObj.sign,
        txObj.destinationChain,
        txObj.receiver,
      ],
      to: contractAddress as Address,
    });
  }
  // Contract transaction response.
  // return c.contract({
  //   abi: usdcAbi,
  //   chainId: chainEip as (typeof allowedChainIds)[number],
  //   functionName: "transferWithAuthorization",
  //   args: [
  //     txObj.sender,
  //     txObj.receiver,
  //     txObj.amount,
  //     txObj.validAfter,
  //     txObj.validBefore,
  //     pad(validateAddress(txObj.nonce.toString())),
  //     txObj.sign,
  //   ],
  //   to: contractAddress as Address,
  // });
});

export const GET = handle(app);
export const POST = handle(app);
