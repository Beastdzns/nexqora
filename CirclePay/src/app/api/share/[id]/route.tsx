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

// Frame route that uses a document ID from the URL
app.frame("/:id", async (c) => {
  console.log("id endpoint CALLED-----------");
  const id = c.req.param();

  const txObj = await fetchTransactions(id.id);
  console.log(txObj);
  console.log("the initi", txObj.initiator);

  return c.res({
    image: `https://sarvagna.vercel.app/assets/1-0b86c9e7.png`,
    intents: [
      // eslint-disable-next-line react/jsx-key
      <Button.Transaction target={`/execute/${id.id}`}>
        Execute
      </Button.Transaction>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
