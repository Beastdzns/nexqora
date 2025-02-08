import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection
const uri =
  process.env.NEXT_PUBLIC_MONGODB_URI || "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const dbName = "sponsors";
const collectionName = "Campaigns";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request data
    const { id, owner, reserve } = await request.json();

    if (!id || !owner || !reserve) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const campaignData = {
      id,
      owner,
      reserve,
    };

    // Connect to MongoDB and insert the data
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(campaignData);

    // Respond with success
    return NextResponse.json({
      message: "Campaign stored successfully",
      result,
    });
  } catch (error) {
    console.error("Error storing transaction:", error);
    return NextResponse.json(
      { error: "Error storing Campaign" },
      { status: 500 }
    );
  } finally {
    // Ensure the MongoDB client connection is closed
    await client.close();
  }
}
