import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection
const uri =
  process.env.NEXT_PUBLIC_MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);
const dbName = "transferData";
const collectionName = "Transactions";

export async function PATCH(request: NextRequest) {
  try {
    // Parse the request body to get necessary data
    const { transactionId, transactionHash } = await request.json();

    if (!transactionId || !transactionHash) {
      return NextResponse.json(
        { error: "Missing transactionId or transactionHash" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Step 1: Check if the transaction has already been executed
    const transaction = await collection.findOne({
      _id: new ObjectId(transactionId),
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.executed) {
      // Step 2: If already executed, return an error message
      return NextResponse.json(
        { message: "Transaction has already been executed" },
        { status: 400 }
      );
    }

    // Step 3: Proceed to update the transaction (if not already executed)
    const result = await collection.updateOne(
      { _id: new ObjectId(transactionId) },
      {
        $set: {
          executed: true,
          executionTime: new Date(),
          transactionHash: transactionHash,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Error updating transaction" },
      { status: 500 }
    );
  } finally {
    // Ensure the MongoDB client connection is closed
    await client.close();
  }
}
