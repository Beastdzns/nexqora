import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection
const uri =
  process.env.NEXT_PUBLIC_MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);
const dbName = "transferData";
const collectionName = "Transactions";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request data
    const body = await request.json();
    const {
      initiator,
      sender,
      receiver,
      amount,
      validAfter,
      validBefore,
      chainId,
      executed,
      sign,
      nonce,
      destinationChain,
    } = body;

    // Check for required fields
    if (
      initiator === undefined ||
      sender === undefined ||
      receiver === undefined ||
      amount === undefined ||
      chainId === undefined ||
      sign === undefined ||
      validAfter === undefined ||
      validBefore === undefined ||
      nonce === undefined ||
      destinationChain === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the data object to store in the database
    const transactionData = {
      initiator,
      sender,
      receiver,
      amount,
      validAfter,
      validBefore,
      chainId,
      executed: executed || false,
      sign,
      nonce,
      destinationChain,
      initiateDate: new Date(),
    };

    // Connect to MongoDB and insert the data
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(transactionData);

    // Respond with success
    return NextResponse.json({
      message: "Transaction stored successfully",
      result,
    });
  } catch (error) {
    console.error("Error storing transaction:", error);
    return NextResponse.json(
      { error: "Error storing transaction" },
      { status: 500 }
    );
  } finally {
    // Ensure the MongoDB client connection is closed
    await client.close();
  }
}
