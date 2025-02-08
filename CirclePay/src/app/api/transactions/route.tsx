import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection
const uri =
  process.env.NEXT_PUBLIC_MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);
const dbName = "transferData";
const collectionName = "Transactions";

export async function GET(request: NextRequest) {
  try {
    // Get the search params from the request
    const { searchParams } = new URL(request.url);
    const initiator = searchParams.get("initiator");
    const sender = searchParams.get("sender");
    const receiver = searchParams.get("receiver");
    const statusParam = searchParams.get("status");

    // Build the query object based on the provided parameters
    let query: any = {};

    // Add address filters if provided
    if (initiator) {
      query.initiator = initiator;
    }

    if (sender) {
      query.sender = sender;
    }

    if (receiver) {
      query.receiver = receiver;
    }

    // Add status filter if provided, or include both true and false if not provided
    if (statusParam !== null) {
      query.executed = statusParam === "true";
    }

    // Connect to MongoDB and retrieve the data
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch transactions matching the query
    const transactions = await collection.find(query).toArray();

    // Respond with the filtered transactions
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Error fetching transactions" },
      { status: 500 }
    );
  } finally {
    // Ensure the MongoDB client connection is closed
    await client.close();
  }
}
